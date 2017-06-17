#!/usr/bin/env python
import cherrypy
import os
import sys
from sqlalchemy import create_engine

import models
from api import ResourceApi
from commands import Command

PATH = os.path.abspath(os.path.join(os.path.dirname(__file__)))
STATIC = os.path.join(PATH, 'static')
NODE = os.path.join(PATH, 'node_modules')
sys.path.append(PATH)


def get_cp_config():
    config = {
        '/': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': STATIC,
            'tools.sessions.on': True
        },
        '/api': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher()
        },
        '/vendor': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': NODE
        }
    }
    return config


class Root(object):
    api = ResourceApi()

    def index(self):
        cherrypy.response.headers['Content-Type'] = 'text/html'
        return open(os.path.join(STATIC, "index.html"))
    index.exposed = True


def RunServer():

    open('dragonDB.db', 'a').close()
    print "db opened."
    dbURL = 'sqlite:///dragonDB.db'

    db = create_engine(dbURL)

    print "Initializing database tables..."
    models.Base.metadata.create_all(db)

    cherrypy.tree.mount(Root(), '/', config=get_cp_config())
    cherrypy.server.socket_host = "0.0.0.0"
    cherrypy.server.socket_port = int(os.environ.get('PORT', 5000))
    cherrypy.engine.start()
    cherrypy.engine.block()


if __name__ == "__main__":
    args = sys.argv
    if len(args) > 1:
        if(args[1] == "run"):
            print "starting server!"
            RunServer()
        elif(args[1] == "loadFixtures"):
            print "loading fixtures"
            Command.LoadFixtures()
        elif(args[1] == "serialPoller"):
            print "starting poller"
            Command.SerialPoller()
        elif args[1] == "weatherSensor":
            print "getting weather data"
            Command.WeatherSensor()
        elif args[1] == "cleanReadings":
            print "cleaning readings"
        elif args[1] == "fishCam":
            print "Starting Fish Cam."
            Command.FishCam()
        elif args[1] == "gpioPoller":
            print "reading from gpio"
            Command.GpioPoller()
        else:
            print 'Did not understand the command, please try again.'
    else:
        print"Could not understand arguements, use one from the following list:"
        print "\n\nServer:"
        print "run - Starts the server."
        print "\nData:"
        print "loadFixtures - Loads some sample data into the database via the api."
        print "serialPoller - Start polling for USB devices to get data from."
        print "weatherSensor - Requests data from lascruce-weather.org to get temperature."
        print "fishCam - Takes a picture every 5 mintues."
