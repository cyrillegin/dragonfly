'''
Dragonfly
Cyrille Gindreau
2017

sensor.py
API endpoint for sensors.

GET
/api/sensor
returns an array of all of the sensors in database.

POST
preconditions: 'name' of sensor.
optional arguments: 'created', 'description', 'coefficients', 'sensor_type'
    'units', 'lastReading', 'min_value', 'max_value'
Queries database for sensor with 'name'
If sensor doesn't exist, a new one is created.
If sensor does exist, will update sensor with any of the optional arguments.

'''
import json
import cherrypy
import time

from sessionManager import sessionScope
from models import Sensor


class Sensors:
    exposed = True

    def GET(self, sensor_name=None):
        cherrypy.response.headers['Content-Type'] = 'application/json'
        with sessionScope() as session:
            if sensor_name is None:
                print 'returning everything'
                data = {"sensor_list": []}
                objs = session.query(Sensor)
                for i in objs:
                    data['sensor_list'].append(i.toDict())
                return json.dumps(data)
            else:
                sensor = session.query(Sensor).filter_by(name=sensor_name).one()
                data = sensor.toDict()
                return json.dumps(data)

    def POST(self):
        print "POST request to sensor."
        cherrypy.response.headers['Content-Type'] = 'application/json'
        try:
            data = json.loads(cherrypy.request.body.read())
        except ValueError:
            data = {}

        if "name" not in data:
            return json.dumps({"Error": "You must provide a sensor name."})
        with sessionScope() as session:
            try:
                sensor = session.query(Sensor).filter_by(name=data['name']).one()
                print "Sensor found. Checking for updates."
                UpdateSensor(sensor, data, session)
            except Exception:
                print "Sensor not found. Creating new one."
                CreateSensor(data, session)


ATTRIBUTES = ['created', 'name', 'description', 'coefficients', 'sensor_type', 'units', 'lastReading', 'min_value', 'max_value']
DEFAULTS = [time.time(), None, "", '1,0', None, None, 0, 0, 1024]


def CreateSensor(data, session):
    sensor = Sensor(name=data['name'])
    for i in range(0, len(ATTRIBUTES)):
        if ATTRIBUTES[i] in data:
            setattr(sensor, ATTRIBUTES[i], data[ATTRIBUTES[i]])
        else:
            setattr(sensor, ATTRIBUTES[i], DEFAULTS[i])
    session.add(sensor)
    session.commit()
    print "Sensor created."


def UpdateSensor(sensor, data, session):
    for i in range(0, len(ATTRIBUTES)):
        if ATTRIBUTES[i] == 'name':
            continue
        if ATTRIBUTES[i] in data:
            setattr(sensor, ATTRIBUTES[i], data[ATTRIBUTES[i]])
        session.add(sensor)
        session.commit()
    print "Sensor updated"
