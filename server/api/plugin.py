import json
import cherrypy
import logging
from sessionManager import sessionScope
import plugins
import os
# from models import Sensor
# from api.Reading import addReading
import time
import importlib

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


class Plugins:
    exposed = True

    def GET(self, **kwargs):
        logging.info('GET request to plugins.')

        cherrypy.response.headers['Content-Type'] = 'application/json'

        return json.dumps({'plugins': plugins.PLUGINS})

    def POST(self):
        logging.info('POST request to plugins')

        try:
            data = json.loads(cherrypy.request.body.read())
        except ValueError:
            logging.error('Json data could not be read.')
            return {"error": "Data could not be read."}

        if 'plugin' not in data:
            logging.error('No plugin info was given.')
            return json.dumps({'error': 'No plugin info was given.'})

        if 'details' not in data:
            logging.error('No plugin details were given.')
            return json.dumps({'error': 'No plugin details were given.'})

        if 'pin' not in data['details']:
            logging.error('No pin was provided.')
            return json.dumps({'error': 'No pin was provided'})
        try:
            module = importlib.import_module("plugins.{}".format(data['plugin']))
            result = module.GetValues({'pin': data['details']['pin'], 'uuid': 'test'})
            return json.dumps(result)
        except Exception as e:
            logging.error(e)
            return json.dumps({'error': e})
