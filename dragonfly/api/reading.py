import json
import cherrypy
import time

from sessionManager import sessionScope
from models import Reading, Sensor
import sensor


class Readings:
    exposed = True

    def GET(self, sensor_name):
        cherrypy.response.headers['Content-Type'] = 'application/json'
        if sensor_name is None:
            data = {"error": "Must provide a sensor name."}
            return json.dumps(data)
        with sessionScope() as session:
            sensor = session.query(Sensor).filter_by(name=sensor_name).one()
            readings = session.query(Reading).filter_by(sensor=sensor_name)
            data = {
                "readings": [],
                "sensor": sensor.toDict()
            }
            for i in readings:
                data['readings'].append(i.toDict())
            return json.dumps(data)

    def POST(self):
        cherrypy.response.headers['Content-Type'] = 'application/json'
        try:
            data = json.loads(cherrypy.request.body.read())
        except ValueError:
            data = {}

        if "sensor_name" not in data:
            return json.dumps({"Error": "Must provide a sesnor name."})
        if "value" not in data:
            return json.dumps({"Error": "Must provide a value to add."})
        with sessionScope() as session:
            try:
                cursensor = session.query(Sensor).filter_by(name=data['sensor_name']).one()
                AddReading(data, session)
            except Exception, e:
                print e
                print "Sensor not found. Sending to sensor api"
                sensor.CreateSensor({"name": data['sensor_name']}, session)
                AddReading(data, session)


ATTRIBUTES = ['created', 'name', 'description', 'coefficients', 'self_type', 'units', 'lastReading', 'min_value', 'max_value']
DEFAULTS = [time.time(), None, "", '1,0', None, None, 0, 0, 1024]


def AddReading(data, session):
    newReading = Reading(created=time.time(), sensor=data['sensor_name'], value=data['value'])
    session.add(newReading)
    session.commit()
