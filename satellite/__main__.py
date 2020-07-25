#!/usr/bin/env python
import os
from dotenv import load_dotenv
import cherrypy
from cherrypy.lib.static import serve_file
from SensorManager import SensorManager


class Root(object):

    # Check if sensor can be created
    @cherrypy.expose
    def sensorCheck(self, *args, **kwargs):
        if kwargs['sensorType'] == 'manual':
            return 'healthy'
        elif kwargs['sensorType'] == 'temperature':
            # Actually check
            return sensorManager.testSensor()
        else:
            return 'unhealthy'

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


def RunServer():
    cherrypy.tree.mount(Root(), '/')
    cherrypy.server.socket_host = "0.0.0.0"
    cherrypy.server.socket_port = os.getenv('PORT')
    cherrypy.engine.start()
    cherrypy.engine.block()


if __name__ == "__main__":
    print("starting server!")
    load_dotenv()
    sensorManager = SensorManager()
    RunServer()
