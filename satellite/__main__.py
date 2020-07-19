#!/usr/bin/env python
import cherrypy
from cherrypy.lib.static import serve_file
from SensorManager import SensorManager

class Root(object):

    # Check if sensor can be created
    @cherrypy.expose
    def sensorCheck(self, *args, **kwargs):
        print('Checking sensor')
        print("type = ")
        print(kwargs)
        if kwargs['sensorType'] == 'manual':
            return 'healthy'
        elif kwargs['sensorType'] == 'temperature':
            # Actually check
            return 'healthy'
        else:
            return 'unhealthy'

    # Check if station exists
    @cherrypy.expose
    def health(self, *args, **kwargs):
        print('Got health check')
        return 'healthy'

    # Check if sensor is currently running
    @cherrypy.expose
    def sensorHealth(self, *args, **kwargs):
        print('Checking sensor health')
        sensorManager.checkSensor()

    # Start a sensor
    @cherrypy.expose
    def startSensor(self, *args, **kwargs):
        print('Starting a sensor')
        sensorManager.startSensor()

    # Stop a sensor
    @cherrypy.expose
    def stopSensor(self, *args, **kwargs):
        print('stoping a sensor')
        sensorManager.stopSensor()


def RunServer():
    cherrypy.tree.mount(Root(), '/')
    cherrypy.server.socket_host = "0.0.0.0"
    cherrypy.server.socket_port = 3001
    cherrypy.engine.start()
    cherrypy.engine.block()


if __name__ == "__main__":
    print("starting server!")
    print(SensorManager)
    sensorManager = SensorManager()
    RunServer()
