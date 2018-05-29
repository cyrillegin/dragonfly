import json
import cherrypy
import logging
import datetime
from sessionManager import sessionScope
from models import Sensor
from api.Reading import addReading
from short_uuid import short_uuid
import time

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


class Sensors:
    exposed = True

    def GET(self):
        logging.info('GET request to sensors.')

        cherrypy.response.headers['Content-Type'] = 'application/json'

        with sessionScope() as session:
            data = session.query(Sensor)
            payload = [{'thing': 'here'}]
            for i in data:
                payload.append(i.toDict())
            return json.dumps(payload)

    def POST(self):
        # Save in database
        logging.info('POST request to sensors')

        try:
            data = json.loads(cherrypy.request.body.read())
        except ValueError:
            logging.error('Json data could not be read.')
            return {"error": "Data could not be read."}

        if 'sensor' not in data:
            logging.info('error: no sensor information in data')
            return json.dumps({'error': 'No sensor information in data.'})

        if 'uuid' not in data['sensor']:
            logging.info('error: data had no uuid')
            return json.dumps({'error': 'UUID is a required field.'})

        with sessionScope() as session:
            try:
                DbSensor = session.query(Sensor).filter_by(uuid=data['sensor']['uuid']).one()
                logging.info('Sensor found, checking for updates')
                sensor = updateSensor(session, DbSensor, data['sensor'])
            except Exception:
                logging.info('Sensor not found, creating new one.')
                sensor = createSensor(session, data['sensor'])

            payload = {
                'sensor': sensor
            }

            if 'reading' in data:
                try:
                    res = addReading(session, sensor, data['reading'])
                    payload['reading'] = res
                except Exception as e:
                    logging.info('Error adding reading to db.')
                    logging.error(e)
                    payload['error'] = str(e)

        print payload
        return json.dumps(payload)


def updateSensor(session, DbSensor, data):
    updates = False
    for i in data:
        if i not in ['uuid', 'created', 'modified'] and data[i] != DbSensor.toDict()[i]:
            updates = True
            setattr(DbSensor, i, data[i])
            print i
    if updates:
        logging.info('Sensor has changed, updating.')
        session.add(DbSensor)
        session.commit()
    return session.query(Sensor).filter_by(uuid=data['uuid']).one().toDict()


def createSensor(session, data):
    sensor = {
        'uuid': data['uuid']
    }
    if 'timestamp' in data:
        sensor['created'] = data['timestamp']
        sensor['modified'] = data['timestamp']
    else:
        sensor['created'] = time.time() * 1000
        sensor['modified'] = time.time() * 1000

    if 'name' in data:
        sensor['name'] = data['name']
    else:
        sensor['name'] = 'newSensor'

    if 'station' in data:
        sensor['station'] = data['station']
    else:
        sensor['station'] = 'newStation'
    newSensor = Sensor(**sensor)

    session.add(newSensor)
    session.commit()
    return session.query(Sensor).filter_by(uuid=sensor['uuid']).one().toDict()
