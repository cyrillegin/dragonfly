import cherrypy
from sqlalchemy.orm.exc import NoResultFound
try:
    import simplejson as json
except ImportError:
    import json


class Sensors:

    exposed = True

    def POST(self):
        print"\nGot a post!\n"
        return "hello"

    def GET(self):
        print"\nGot a get!\n"
        return "hello"
