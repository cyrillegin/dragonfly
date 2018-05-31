import json
import cherrypy
import logging
import datetime
import time
from sessionManager import sessionScope
from models import Reading
from short_uuid import short_uuid

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


class Readings:
    exposed = True

    def GET(self, **kwargs):
        logging.info('GET request to readings.')

        cherrypy.response.headers['Content-Type'] = 'application/json'

        print kwargs
        if 'sensor' not in kwargs:
            logging.error('No sensor was given.')
            return json.dumps({'error': 'No sensor was given.'})

        with sessionScope() as session:
            data = session.query(Reading).filter_by(sensor=kwargs['sensor'])
            if 'start_time' in kwargs:
                data.filter(Reading.timestamp >= kwargs['start_time'])
            else:
                data.filter(Reading.timestamp >= (time.time() - 60 * 60 * 24) * 1000)

            if 'send)time' in kwargs:
                data.filter(Reading.timestamp <= kwargs['end_time'])
            # No else because we shouldn't have readings in the future.

            payload = []
            for i in data:
                payload.append(i.toDict())
            return json.dumps(payload)

    def POST(self):
        id = short_uuid()
        # Save in database
        logging.info('saving reading in database')

        with sessionScope() as session:
            readingModel = Reading(
                uuid=id,
                created=datetime.datetime.now(),
            )
            session.add(readingModel)
            session.commit()

        return json.dumps('success')


def addReading(session, sensor, reading):
    newId = short_uuid()
    newReading = Reading(uuid=newId, timestamp=reading['timestamp'], value=reading['value'], sensor=sensor['uuid'])
    logging.info('Adding new reading')
    session.add(newReading)
    session.commit()
    return session.query(Reading).filter_by(uuid=newId).one().toDict()
