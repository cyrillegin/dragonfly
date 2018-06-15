import json
import cherrypy
import logging
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

            start = (time.time() - 60 * 60 * 24) * 1000
            end = time.time()

            if 'start' in kwargs:
                start = int(kwargs['start'])
            else:
                data.filter(Reading.timestamp >= (time.time() - 60 * 60 * 24) * 1000)

            if 'end' in kwargs:
                end = int(kwargs['end'])
            # No else because we shouldn't have readings in the future.
            print time.time()
            print start
            print end
            data = session.query(Reading).filter_by(sensor=kwargs['sensor']).filter(Reading.timestamp >= start).filter(Reading.timestamp <= end)

            payload = []
            for i in data:
                payload.append(i.toDict())
            print "\nall done\n"
            return json.dumps(payload)

    # def POST(self):
    #
    #     id = short_uuid()
    #     # Save in database
    #     logging.info('saving reading in database')
    #
    #     with sessionScope() as session:
    #         readingModel = Reading(
    #             uuid=id,
    #             created=datetime.datetime.now(),
    #         )
    #         session.add(readingModel)
    #         session.commit()
    #
    #     return json.dumps('success')


def addReading(session, sensor, reading):
    newId = short_uuid()
    newReading = Reading(uuid=newId, timestamp=reading['timestamp'], value=reading['value'], sensor=sensor['uuid'])
    logging.info('Adding new reading')
    session.add(newReading)
    session.commit()
    return session.query(Reading).filter_by(uuid=newId).one().toDict()
