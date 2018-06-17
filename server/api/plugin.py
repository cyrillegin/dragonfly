import json
import cherrypy
import logging
import plugins
import importlib

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


class Plugins:
    exposed = True

    def GET(self, **kwargs):
        logging.info('GET request to plugins.')

        cherrypy.response.headers['Content-Type'] = 'application/json'

        return json.dumps({'plugins': plugins.PLUGINS}).encode('utf-8')

    def POST(self):
        logging.info('POST request to plugins')

        try:
            data = json.loads(cherrypy.request.body.read().decode('utf-8'))
        except ValueError:
            logging.error('Json data could not be read.')
            return json.dumps({"error": "Data could not be read."}).encode('utf-8')

        if 'plugin' not in data:
            logging.error('No plugin info was given.')
            return json.dumps({'error': 'No plugin info was given.'}).encode('utf-8')

        if 'details' not in data:
            logging.error('No plugin details were given.')
            return json.dumps({'error': 'No plugin details were given.'}).encode('utf-8')

        if 'pin' not in data['details']:
            logging.error('No pin was provided.')
            return json.dumps({'error': 'No pin was provided'}).encode('utf-8')
        try:
            module = importlib.import_module("plugins.{}".format(data['plugin']))
            result = module.GetValues({'pin': data['details']['pin'], 'uuid': 'test'})
            return json.dumps(result).encode('utf-8')
        except Exception as e:
            logging.error(e)
            return json.dumps({'error': e}).encode('utf-8')
