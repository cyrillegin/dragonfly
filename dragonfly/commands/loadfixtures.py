'''
Dragonfly
Cyrille Gindreau
2017

loadfixtures.py

Sends test data to api.

'''
import math
import requests
import json


def loadfixtures():
    sensorUrl = "http://localhost:8000/api/sensor"
    readingUrl = "http://localhost:8000/api/reading"

    testTemp = {
        'name': "waterTemp",
        'description': "A test sensor",
        'coefficients': "(1,0)",
        'sensor_type': "temperature",
        'units': "F",
        'min_value': 65,
        'max_value': 85
    }
    print "saving waterTemp"
    requests.post(sensorUrl, json.dumps(testTemp))
    for i in range(0, 24 * 60):
        newReading = {
            "sensor_name": "waterTemp",
            "value": 60 + 7 * math.sin(0.1 * i)
        }
        requests.post(readingUrl, json.dumps(newReading))

    testTurb = {
        'name': "waterTurb",
        'description': "A test sensor",
        'coefficients': "(1,0)",
        'sensor_type': "temperature",
        'units': "F",
        'min_value': 300,
        'max_value': 900
    }
    print "saving waterTurb"
    requests.post(sensorUrl, json.dumps(testTurb))
    for i in range(0, 24 * 60):
        newReading = {
            "sensor_name": "waterTurb",
            "value": 600 + 200 * math.sin(0.1 * i)
        }
        requests.post(readingUrl, json.dumps(newReading))

    testSwitch = {
        'name': "lightSwitch",
        'description': "A test switch",
        'sensor_type': "lightswitch",
    }
    print "saving lightSwitch"
    requests.post(sensorUrl, json.dumps(testSwitch))
    for i in range(0, 24 * 60):
        newReading = {
            "sensor_name": "lightSwitch",
            "value": int(0.5 + math.sin(0.1 * i))
        }
        requests.post(readingUrl, json.dumps(newReading))
