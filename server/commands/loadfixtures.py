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
import logging

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)

# Use for going to heroku
# readingUrl = "https://dragonf1y.herokuapp.com/api/reading"

# Use if just testing localy
readingUrl = "http://localhost:5000/api/reading"


def loadfixtures():

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
    logging.info("Sending post for testTemp")
    response = requests.post(readingUrl, json.dumps(newReadings))
    logging.debug("Response was: {}".format(response))

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
    logging.info("Sending post for testTurb")
    response = requests.post(readingUrl, json.dumps(newReadings))
    logging.debug("Response was: {}".format(response))

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
    logging.info("Sending post for testSwitch")
    response = requests.post(readingUrl, json.dumps(newReadings))
    logging.debug("Response was: {}".format(response))
