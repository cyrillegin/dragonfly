import json
import cherrypy
import logging
import time
from sessionManager import sessionScope
from models import Reading
from api.short_uuid import short_uuid

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


class Readings:
    exposed = True

    def GET(self, **kwargs):
        logging.info('GET request to readings.')

        cherrypy.response.headers['Content-Type'] = 'application/json'

        if 'sensor' not in kwargs:
            logging.error('No sensor was given.')
            return json.dumps({'error': 'No sensor was given.'}).encode('utf-8')

        with sessionScope() as session:

            start = (time.time() - 60 * 60 * 24) * 1000
            end = time.time() * 1000

            if 'start' in kwargs:
                start = int(kwargs['start'])

            if 'end' in kwargs:
                end = int(kwargs['end'])

            data = session.query(Reading).filter_by(sensor=kwargs['sensor']).filter(Reading.timestamp >= start).filter(Reading.timestamp <= end)

            payload = []
            for i in data:
                payload.append(i.toDict())
            return json.dumps(payload).encode('utf-8')

    def POST(self):
        logging.info('POST request to readings.')
        try:
            data = json.loads(cherrypy.request.body.read().decode('utf-8'))
        except ValueError:
            logging.error('Json data could not be read.')
            return json.dumps({"error": "Data could not be read."}).encode('utf-8')
        print(data)
    
        with sessionScope() as session:
            newId = short_uuid()
            
            newReading = Reading(uuid=newId, timestamp=time.time(), value=data['value'], sensor=data['uuid'])
            session.add(newReading)
            session.commit()
            return session.query(Reading).filter_by(uuid=newId).one().toDict()
        return json.dumps('success')


def addReading(session, sensor, reading):
    newId = short_uuid()
    newReading = Reading(uuid=newId, timestamp=reading['timestamp'], value=reading['value'], sensor=sensor['uuid'])
    logging.info('Adding new reading')
    session.add(newReading)
    session.commit()
    return session.query(Reading).filter_by(uuid=newId).one().toDict()
