'''
Dragonfly
Cyrille Gindreau
2017

reading.py
API endpoint for readings

GET
preconditions: sensor name, start, end
Returns all readings for 'sensor' between 'start' and 'end' times.

POST
preconditions: sensor name, value
Inserts a new reading for 'sensor_name' with 'value'


'''
import json
import cherrypy
import time

from sessionManager import sessionScope
from models import Reading, Sensor
import sensor


class Readings:
    exposed = True

    def GET(self, **kwargs):
        cherrypy.response.headers['Content-Type'] = 'application/json'
        if kwargs['sensor'] is None:
            data = {"error": "Must provide a sensor name."}
            return json.dumps(data)
        data = getReadings(kwargs['sensor'], kwargs['start'], kwargs['end'])
        return json.dumps(data)

    def POST(self):
        cherrypy.response.headers['Content-Type'] = 'application/json'
        try:
            data = json.loads(cherrypy.request.body.read())
        except ValueError:
            data = {}

        if "sensor" not in data:
            return json.dumps({"Error": "Must provide a sesnor name."})
        if "readings" not in data:
            return json.dumps({"Error": "Must provide (a) value(s) to add."})
        with sessionScope() as session:
            try:
                cursensor = session.query(Sensor).filter_by(name=data['sensor']['name']).one()
            except Exception, e:
                print e
                print "Sensor not found. Sending to sensor api"
                cursensor = sensor.CreateSensor(data['sensor'], session)
            for i in data['readings']:
                AddReading(i, cursensor, session)


def getReadings(sensor_id, start, end):
    with sessionScope() as session:
        try:
            sensor = session.query(Sensor).filter_by(name=sensor_id).one()
            readings = session.query(Reading).filter_by(sensor=sensor_id).filter(Reading.created >= int(start), Reading.created <= int(end))
            data = {
                "readings": [],
                "sensor": sensor.toDict()
            }
            for i in readings:
                data['readings'].append(i.toDict())
        except Exception, e:
            data = {
                "error": e
            }
    print data
    return data


def AddReading(data, cursensor, session):
    if "timestamp" in data:
        curtime = data['timestamp']
    else:
        curtime = time.time()
    newReading = Reading(created=curtime, sensor=cursensor.toDict()['name'], value=data['value'])
    setattr(cursensor, 'last_reading', data['value'])
    session.add(cursensor)
    session.add(newReading)
    session.commit()
