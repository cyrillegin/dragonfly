#!/usr/bin/env python
import cherrypy
import os
import sys
import jinja2
import logging
from sqlalchemy import create_engine

import models
from api import ResourceApi
from commands import Command
from version import minorVersion, majorVersion, VERSION, BUILD_DATE
import config

PATH = os.path.abspath(os.path.dirname(__file__))
STATIC = os.path.join(PATH, '../static')
sys.path.append(PATH)

env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(searchpath=os.path.join(PATH, '../static/')), )


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
    }
    return config


def CheckBackups():
    latestBackup = 0
    for filename in os.listdir(os.path.join(PATH, "..", "dbBackups")):
        if os.path.getmtime(os.path.join(PATH, "..", "dbBackups", filename)) > latestBackup:
            latestBackup = os.path.getmtime(os.path.join(PATH, "..", "dbBackups", filename))
    return latestBackup


class Root(object):
    api = ResourceApi()

    def index(self):
        lastBackup = CheckBackups()
        context = {
            "lastBackup": lastBackup,
            "version": VERSION,
            "buildDate": BUILD_DATE,
        }
        t = env.get_template("index.html")
        return t.render(context)
    index.exposed = True


def RunServer():

    open('../dragonDB.db', 'a').close()
    logging.info("db opened.")
    dbURL = "sqlite:///dragonDB.db"

    db = create_engine(dbURL)

    logging.info("Initializing database tables...")
    models.Base.metadata.create_all(db)

    cherrypy.tree.mount(Root(), '/', config=get_cp_config())
    cherrypy.server.socket_host = "0.0.0.0"
    cherrypy.server.socket_port = int(os.environ.get('PORT', 5000))
    cherrypy.engine.start()
    cherrypy.engine.block()


if __name__ == "__main__":
    args = sys.argv
    if len(args) > 1:
        arg = "{}".format(args[1]).lower()
        if(arg == "run"):
            logging.info("starting server!")
            RunServer()
        elif(arg == "loadfixtures"):
            logging.info("loading fixtures")
            Command.LoadFixtures()
        elif(arg == "serialpoller"):
            logging.info("starting poller")
            Command.SerialPoller()
        elif arg == "weathersensor":
            logging.info("getting weather data")
            Command.WeatherSensor()
        elif arg == "cleanreadings":
            logging.info("cleaning readings")
        elif arg == "fishcam":
            logging.info("Starting Fish Cam.")
            Command.FishCam()
        elif arg == "gpiopoller":
            logging.info("reading from gpio")
            Command.GpioPoller()
        elif arg == "pressurepoller":
            logging.info("reading from pressure poller")
            Command.PressurePoller()
        elif arg == "wiresensor":
            logging.info("reading from one wire sensor.")
            Command.OneWirePoller(config.SENSORS[1])
        elif arg == "motionsensor":
            logging.info("reading from motion sensor.")
            Command.MotionPoller(config.SENSORS[0])
        elif arg == "startpollers":
            logging.info("Starting pollers.")
            Command.PollerController(config.SENSORS)
        elif arg == "cryptopoller":
            logging.info("Starting crypto poller.")
            Command.CryptoPoller(config.SENSORS[0])
        elif arg == "incminor":
            logging.info("Incrementing minor version")
            minorVersion()
        elif arg == "incmajor":
            logging.info("Incrementing major version")
            majorVersion()
        else:
            logging.info('Did not understand the command, please try again.')
    else:
        logging.info("Could not understand arguements, use one from the following list:")
        logging.info("\n\nServer:")
        logging.info("run - Starts the server.")
        logging.info('\n\nPolling:')
        logging.info('startPollers - Runs all of the pollers defined in config.py')
        logging.info("\nData:")
        logging.info("loadFixtures - Loads some sample data into the database via the api.")
        logging.info("weatherSensor - Requests data from lascruce-weather.org to get temperature.")
        logging.info("fishCam - Takes a picture every 5 mintues.")
        logging.info("\nPollers:")
        logging.info("serialPoller - Start polling for USB devices to get data from.")
        logging.info("gpioPoller - Start polling for raspberry pi gpio pins to get data from.")
        logging.info("pressurePoller - Start polling the pressure sensor.")
        logging.info("wiresensor - Poll from a One Wire sensor.")
        logging.info("motionSensor - Start polling a motion sensor.")
        logging.info("cryptoPoller - Start polling crypto api.")
