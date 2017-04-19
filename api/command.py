'''
Dragonfly
Cyrille Gindreau
2017

command.py

POST
Writes input to a json file that will be sent to the microcontroller.
Input: {
    Key, Value
}
Example:
Turns on a light.
{
    lightswitch: true
}

'''
import json
import cherrypy


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
