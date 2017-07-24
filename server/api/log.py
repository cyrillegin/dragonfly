'''
Dragonfly
Cyrille Gindreau
2017

log.py
API endpoint for logs

GET
Returns an object with array of logs

POST
Adds a new log.
Params: A json object with keys 'title' and 'description'.

'''
import json
import cherrypy
import time
import logging

from server.sessionManager import sessionScope
from server.models import Log


class Logs:
    logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)

    exposed = True

    def GET(self):
        logging.info('GET request to log')

        cherrypy.response.headers['Content-Type'] = 'application/json'

        with sessionScope() as session:
            try:
                logs = session.query(Log)
                data = {"logs": []}
                for i in logs:
                    data['logs'].append(i.toDict())
            except Exception, e:
                data = {
                    "error": e,
                    "note": "No logs currently exist."
                }
                logging.error(data)
            return json.dumps(data)

    def POST(self):
        logging.info("POST request to log.")

        cherrypy.response.headers['Content-Type'] = 'application/json'

        try:
            data = json.loads(cherrypy.request.body.read())
        except Exception, e:
            logging.error(e)
            return "error data could not be read."

        if "title" not in data:
            data = {
                "error": "Must provide a title."
            }
            logging.error('No title found.')
        elif "description" not in data:
            data = {
                "error": "Must provide a description."
            }
            logging.error('No description found.')
        else:
            with sessionScope() as session:
                newLog = Log(created=time.time(), title=data['title'], description=data['description'])
                session.add(newLog)
                session.commit()
                logging.info("Log added.")
                data = newLog.toDict()
        return data
