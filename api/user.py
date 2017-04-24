'''
Dragonfly
Cyrille Gindreau
2017

user.py
API endpoint for Users

POST
Adds a new User.
Params: A json object with keys 'name' and 'password'.

'''
import json
import cherrypy

from sessionManager import sessionScope
from models import User


class Users:
    exposed = True

    def POST(self):
        print "POST request to user."
        cherrypy.response.headers['Content-Type'] = 'application/json'
        try:
            data = json.loads(cherrypy.request.body.read())
        except ValueError:
            data = {
                "error": "data could not be read."
            }

        if "name" not in data:
            data = {
                "error": "Must provide a name."
            }
        elif "password" not in data:
            data = {
                "error": "Must provide a password."
            }
        else:
            with sessionScope() as session:
                newUser = User(name=data['user'], password=data['password'])
                session.add(newUser)
                session.commit()
                print "User added."
                data = newUser.toDict()
        return data
