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
import time


def loadfixtures():
    readingUrl = "https://dragonf1y.herokuapp.com/api/reading"

    # Create test sensor
    testTemp = {
        'name': "waterTemp",
        'description': "A test sensor",
        'coefficients': "(1,0)",
        'sensor_type': "temperature",
        'units': "F",
        'min_value': 65,
        'max_value': 85
    }
    # Create data structure to send to api
    newReadings = {
        "sensor": testTemp,
        'readings': []
    }
    # Populate readings
    for i in range(0, 24 * 60):
        newReading = {
            "value": 60 + 7 * math.sin(0.1 * i),
            "timestamp": time.time() - i * 1000
        }
        newReadings['readings'].append(newReading)
    # Make post
    requests.post(readingUrl, json.dumps(newReadings))

    # Create test sensor
    testTurb = {
        'name': "waterTurb",
        'description': "A test sensor",
        'coefficients': "(1,0)",
        'sensor_type': "temperature",
        'units': "F",
        'min_value': 300,
        'max_value': 900
    }

    # Create data structure to send to api
    newReadings = {
        "sensor": testTurb,
        'readings': []
    }

    # Populate readings
    for i in range(0, 24 * 60):
        newReading = {
            "value": 600 + 200 * math.sin(0.1 * i),
            "timestamp": time.time() - i * 1000
        }
        newReadings['readings'].append(newReading)
    # Make post
    requests.post(readingUrl, json.dumps(newReadings))

    # Create test sensor
    testSwitch = {
        'name': "lightSwitch",
        'description': "A test switch",
        'sensor_type': "lightswitch",
    }

    # Create data structure to send to api
    newReadings = {
        "sensor": testSwitch,
        'readings': []
    }

    # Populate readings
    for i in range(0, 24 * 60):
        newReading = {
            "value": int(0.5 + math.sin(0.1 * i)),
            "timestamp": time.time() - i * 1000
        }
        newReadings['readings'].append(newReading)
    requests.post(readingUrl, json.dumps(newReadings))
