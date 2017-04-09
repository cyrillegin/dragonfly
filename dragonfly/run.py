#!/usr/bin/env python
import cherrypy
import os
import sys
import jinja2
from sqlalchemy import create_engine

import models
from api import ResourceApi
from commands import Command

PATH = os.path.abspath(os.path.join(os.path.dirname(__file__)))
STATIC = os.path.join(PATH, 'static')
sys.path.append(PATH)

env = jinja2.Environment(loader=jinja2.FileSystemLoader(searchpath=STATIC))


def get_cp_config():
    config = {
        '/': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': STATIC,
            'tools.sessions.on': True
        },
        '/api': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher()
        }
    }
    return config


class Root(object):
    api = ResourceApi()

    def index(self):
        t = env.get_template("index.html")
        return t.render({})
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
    cherrypy.server.socket_port = 8000
    cherrypy.engine.start()
    cherrypy.engine.block()


if __name__ == "__main__":
    args = sys.argv
    print args
    if len(args) == 1:
        print "starting server!"
        RunServer()
    else:
        if(args[1] == "loadFixtures"):
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
        elif args[1] == "automate":
            print "automating"
        else:
            print "Could not understand arguements, please try again."
