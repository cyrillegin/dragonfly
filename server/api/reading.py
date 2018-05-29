import json
import cherrypy
import logging
import datetime
from sessionManager import sessionScope
from models import Reading
from short_uuid import short_uuid

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


class Readings:
    exposed = True

    def GET(self):
        logging.info('GET request to readings.')

        cherrypy.response.headers['Content-Type'] = 'application/json'

        with sessionScope() as session:
            data = session.query(Reading)
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
    newReading = Reading(uuid=newId, timestamp=reading['timestamp'], sensor=sensor['uuid'])
    logging.info('Adding new reading')
    session.add(newReading)
    session.commit()
    return session.query(Reading).filter_by(uuid=newId).one().toDict()
