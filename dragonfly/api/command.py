import json
import cherrypy

from sessionManager import sessionScope


class Command:
    exposed = True

    def POST(self):
        print "POST request to command."

        cherrypy.response.headers['Content-Type'] = 'application/json'
        try:
            data = json.loads(cherrypy.request.body.read())
        except ValueError:
            data = {}

        with open('commandQueue.json', 'w') as outfile:
            json.dump(data, outfile)
