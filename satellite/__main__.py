#!/usr/bin/env python
import os
import json
from dotenv import load_dotenv
import cherrypy
from cherrypy.lib.static import serve_file
from SensorManager import SensorManager


class Root(object):

    # Check if sensor can be created
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def sensorCheck(self, *args, **kwargs):
        print('checking sensor')
        i = 0
        while True:
            sensor = os.getenv('SENSOR_{}_HARDWARE_NAME'.format(i))
            if sensor is None:
                return 'unhealthy'
                break
            if sensor == kwargs['hardwareSensor']:
                break
            i = i + 1
        cherrypy.response.headers['Content-Type'] = "application/json"
        test = sensorManager.testSensor(i)
        print(test)
        return json.dumps(test)


    # Check if station exists
    @cherrypy.expose
    def health(self, *args, **kwargs):
        return 'healthy'

    # Check if sensor is currently running
    @cherrypy.expose
    def sensorHealth(self, *args, **kwargs):
        sensorManager.checkSensor(kwargs)

    # Start a sensor
    @cherrypy.expose
    def startSensor(self, *args, **kwargs):
        sensorManager.startSensor()

    # Stop a sensor
    @cherrypy.expose
    def stopSensor(self, *args, **kwargs):
        sensorManager.stopSensor()

    # Get list of available sensors
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def list(self, *args, **kwargs):
        i = 0
        sensors = []
        while True:
            sensor = os.getenv('SENSOR_{}_HARDWARE_NAME'.format(i))
            if sensor is None:
                break
            sensors.append(sensor)
            i += 1

        cherrypy.response.headers['Content-Type'] = "application/json"
        return json.dumps(sensors)


def RunServer():
    cherrypy.tree.mount(Root(), '/')
    cherrypy.server.socket_host = "0.0.0.0"
    cherrypy.server.socket_port = int(os.getenv('PORT'))
    cherrypy.engine.start()
    cherrypy.engine.block()


if __name__ == "__main__":
    print("starting server!")
    load_dotenv()
    sensorManager = SensorManager()
    RunServer()
