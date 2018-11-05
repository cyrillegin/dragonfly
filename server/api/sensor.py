import json
import cherrypy
import logging
import time
from sessionManager import sessionScope
from models import Sensor, Reading
from api.reading import addReading
from api.short_uuid import short_uuid

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


class Sensors:
    exposed = True

    def GET(self, **kwargs):
        logging.debug('GET request to sensors.')

        cherrypy.response.headers['Content-Type'] = 'application/json'

        with sessionScope() as session:
            data = session.query(Sensor)
            if 'sensor' in kwargs:
                data = data.filter_by(uuid=kwargs['sensor'])
            payload = []
            for i in data:
                payload.append(i.toDict())
            return json.dumps(payload).encode('utf-8')

    def POST(self):
        # Save in database
        logging.debug('POST request to sensors')

        try:
            data = json.loads(cherrypy.request.body.read().decode('utf-8'))
        except ValueError:
            logging.error('Json data could not be read.')
            return json.dumps({"error": "Data could not be read."}).encode('utf-8')

        if 'sensor' not in data:
            logging.error('error: no sensor information in data')
            return json.dumps({'error': 'No sensor information in data.'}).encode('utf-8')

        if 'poller' not in data['sensor']:
            logging.error('Error: No poller information given.')
            return json.dumps({'Error': 'No poller information in data.'}).encode('utf-8')

        if 'uuid' not in data['sensor']:
            data['sensor']['uuid'] = short_uuid()

        with sessionScope() as session:
            try:
                DbSensor = session.query(Sensor).filter_by(uuid=data['sensor']['uuid']).one()
                logging.debug('Sensor found, checking for updates')
                sensor = updateSensor(session, DbSensor, data['sensor'])
            except Exception:
                logging.debug('Sensor not found, creating new one.')
                sensor = createSensor(session, data['sensor'])

            payload = {
                'sensor': sensor
            }

            if 'reading' in data:
                try:
                    res = addReading(session, sensor, data['reading'])
                    payload['reading'] = res
                except Exception as e:
                    logging.error('Error adding reading to db.')
                    logging.error(e)
                    payload['error'] = str(e)

        return json.dumps(payload).encode('utf-8')

    def PUT(self):
        logging.debug('PUT request to sensors.')

        try:
            data = json.loads(cherrypy.request.body.read().decode('utf-8'))
        except ValueError:
            logging.error('Json data could not be read.')
            return json.dumps({"error": "Data could not be read."}).encode('utf-8')
        if 'uuid' not in data:
            logging.error('No sensor ID found.')
            return json.dumps({"Error": "Sensor id not provided."}).encode('utf-8')
        with sessionScope() as session:
            try:
                sensor = session.query(Sensor).filter_by(uuid=data['uuid']).one()
                logging.debug('Sensor found.')
                payload = {
                    "sensor": updateSensor(session, sensor, data)
                }
            except Exception as e:
                logging.error('Error updating sensor.')
                logging.error(e)
                return json.dumps({'Error': 'Error updating sensor.'}).encode('utf-8')
        return json.dumps(payload).encode('utf-8')

    def DELETE(self, *args, **kwargs):
        logging.info('DELETE request to sensors')
        if 'sensor' not in kwargs:
            logging.error("No sensor given")
            return json.dumps({'error': 'No sensor given.'}).encode('utf-8')
        with sessionScope() as session:
            sensor = session.query(Sensor).filter_by(uuid=kwargs['sensor']).one()
            logging.debug('Deleting all readings for sensor')
            session.query(Reading).filter_by(sensor=kwargs['sensor']).delete()
            logging.debug('Deleting sensor')
            session.delete(sensor)
            session.commit()
            logging.debug('Delete successful')
            return json.dumps({'success': 'delete successful.'}).encode('utf-8')


def updateSensor(session, DbSensor, data):
    updates = False
    for i in data:
        if i not in ['uuid', 'created', 'modified'] and data[i] != DbSensor.toDict()[i]:
            if data[i] == '':
                data[i] = None
            updates = True
            setattr(DbSensor, i, data[i])
    if updates:
        setattr(DbSensor, 'modified', time.time() * 1000)
        logging.debug('Sensor has changed, updating.')
        session.add(DbSensor)
        session.commit()
    return session.query(Sensor).filter_by(uuid=data['uuid']).one().toDict()


def createSensor(session, data):
    # Required Fields
    sensor = {
        'uuid': data['uuid'],
        'poller': data['poller'],
        'status': 'online'
    }

    # Fields with defaults
    if 'timestamp' in data:
        sensor['created'] = data['timestamp']
    else:
        sensor['created'] = time.time() * 1000
    sensor['modified'] = time.time() * 1000

    if 'name' in data:
        sensor['name'] = data['name']
    else:
        sensor['name'] = 'newSensor'

    if 'pollRate' in data:
        sensor['pollRate'] = int(data['pollRate'])
    else:
        sensor['pollRate'] = 60 * 5

    if 'station' in data:
        sensor['station'] = data['station']
    else:
        sensor['station'] = 'newStation'

    # Optional fields.
    if 'coefficients' in data:
        sensor['coefficients'] = data['coefficients']
    if 'description' in data:
        sensor['description'] = data['description']
    if 'endpoint' in data:
        sensor['endpoint'] = data['endpoint']
    if 'pin' in data:
        sensor['pin'] = data['pin']
    if 'station' in data:
        sensor['station'] = data['station']
    if 'units' in data:
        sensor['units'] = data['units']
    if 'meta' in data:
        sensor['meta'] = data['meta']
    newSensor = Sensor(**sensor)

    session.add(newSensor)
    session.commit()
    return session.query(Sensor).filter_by(uuid=sensor['uuid']).one().toDict()
