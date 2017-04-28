#!/usr/bin/env python
import cherrypy
import os
import sys
import jinja2
import json
from sqlalchemy import create_engine

import models
from api import ResourceApi
from commands import Command
from sessionManager import sessionScope

PATH = os.path.abspath(os.path.join(os.path.dirname(__file__)))
STATIC = os.path.join(PATH, 'static')
NODE = os.path.join(PATH, 'node_modules')
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
        t = env.get_template("index.html")
        return t.render({})
    index.exposed = True

    def login(self):
        cherrypy.response.headers['Content-Type'] = 'application/json'
        try:
            data = json.loads(cherrypy.request.body.read())
        except ValueError:
            cherrypy.response.status = 400
            return json.dumps({'error': 'You must supply a username and password.'})
        print 'Checking login credentials'
        with sessionScope() as session:
            try:
                user = session.query(models.User).filter_by(name=data['username']).one()
                print user.toDict()
            except Exception, e:
                print 'err'
                print e
                cherrypy.response.status = 400
                return json.dumps({'error': 'User not found.'})
            if str(user.password) != data['password']:
                cherrypy.response.status = 400
                return json.dumps({'error': 'Wrong password.'})
            return json.dumps({'success': "you're logged in!"})

    login.exposed = True


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
        elif args[1] == "automate":
            print "automating"
            Command.Automate()
        elif args[1] == "backupDatabase":
            print "backing up database"
            Command.Backup()
        elif args[1] == "refreshDatabase":
            print "Refreshing database"
            Command.Refresh()
        elif args[1] == "createUser":
            print "Creating new user."
            Command.CreateUser()
        elif args[1] == "resetPassword":
            print "Resetting password"
            Command.ChangePassword()
        elif args[1] == "getUsers":
            print "Getting users."
            Command.GetUsers()
        elif args[1] == "deleteUser":
            print "Deleting user."
            Command.DeleteUser()
        elif args[1] == "refreshHeroku":
            print "Refreshing Heroku."
            Command.RefreshHeroku()
    else:
        print "Could not understand arguements, use one from the following list:"
        print "\n\nServer:"
        print "run - Starts the server."
        print "\nData:"
        print "loadFixtures - Loads some sample data into the database via the api."
        print "serialPoller - Start polling for USB devices to get data from."
        print "weatherSensor - requests data from lascruce-weather.org to get temperature."
        print "\nDatabase management:"
        print "backupDatabase - Creates a backup database from previous databases and new heroku data."
        print "refreshDatabase - Sends all readings and sensors from backup database and sends it to heroku."
        print "\nUser management:"
        print "createUser - Creates a new user."
        print "resetPassword - Resets the password of a user."
        print "getUsers - Returns a list of users."
        print "deleteUser - Deletes a user."
        print "\nMisc:"
        print "automate - currently under development."
