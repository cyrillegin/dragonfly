#!/usr/bin/env python
import cherrypy
import os
import sys

from sqlalchemy import create_engine
import models

PATH = os.path.abspath(os.path.join(os.path.dirname(__file__)))
STATIC = os.path.join(PATH, 'static')
sys.path.append(PATH)


def get_cp_config():
    config = {
        '/': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': STATIC,
            'tools.staticdir.index': os.path.join(STATIC, 'index.html')
        }
    }
    return config


class Root(object):
    pass


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
        elif(args[1] == "getReadings"):
            print "starting poller"
        elif args[1] == "weatherSensor":
            print "getting weather data"
        elif args[1] == "cleanReadings":
            print "cleaning readings"
        elif args[1] == "automate":
            print "automating"
        else:
            print "Could not understand arguements, please try again."

