import json
import cherrypy
import time

from sessionManager import sessionScope
from models import Log


class Logs:
    exposed = True

    def GET(self):
        cherrypy.response.headers['Content-Type'] = 'application/json'
        with sessionScope() as session:
            logs = session.query(Log)
            data = {"logs": []}
            for i in logs:
                data['logs'].append(i.toDict())
            return json.dumps(data)

    def POST(self):
        print "POST request to log."
        cherrypy.response.headers['Content-Type'] = 'application/json'
        try:
            data = json.loads(cherrypy.request.body.read())
        except ValueError:
            data = {}

        if "title" not in data:
            return json.dumps({"Error": "Must provide a title."})
        if "description" not in data:
            return json.dumps({"Error": "Must provide a description."})
        with sessionScope() as session:
            newLog = Reading(created=time.time(), title=data['title'], description=data['description'])
            session.add(newLog)
            session.commit()
            print "Log added."
