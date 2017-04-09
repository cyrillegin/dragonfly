from django.core.management.base import BaseCommand

import models
import math
import requests
import json


def loadfixtures():
    sensorUrl = "http://localhost:8000/api/sensor"
    readingUrl = "http://localhost:8000/api/reading"

    testTemp1 = {
        'name': "waterTemp",
        'description': "A test sensor",
        'coefficients': "(1,0)",
        'sensor_type': "temperature",
        'units': "F",
        'min_value': 65,
        'max_value': 85
    }
    requests.post(sensorUrl, json.dumps(testTemp1))
    for i in range(0, 24 * 60):
        newReading = {
            "sensor_name": "waterTemp",
            "value": 60 + 7 * math.sin(0.1 * i)
        }
        requests.post(readingUrl, json.dumps(newReading))
    return













    setattr(testTemp1, "lastReading", newVal)
    testTemp2.lastReading = newVal
    print "newVal = {}".format(newVal)
    testTemp1.save()
    testTemp2.save()

    testCleanliness = models.Sensor(name="aquaLight", description="A test sensor", coefficients="(1,0)", sensor_type="cleanliness")
    testCleanliness.save()

    print "Creating readings for aqua light"
    for i in range(0, 24 * 60):
        newVal = 50 + 50 * math.sin(0.1 * i)
        newReading = models.Reading(sensor=testCleanliness, value=newVal)
        newReading.save()
    testCleanliness.lastReading = newVal
    testCleanliness.save()

    testlightSensor1 = models.Sensor(name="plantLight", description="A test sensor", coefficients="(1,0)", sensor_type="lightsensor")
    testlightSensor1.save()

    testlightSensor2 = models.Sensor(name="weatherstation", description="A test sensor", coefficients="(1,0)", sensor_type="lightsensor")
    testlightSensor2.save()

    print "Creating readings for light and weather"
    for i in range(0, 24 * 60):
        newVal = 500 + 500 * math.sin(0.1 * i)
        newReading1 = models.Reading(sensor=testlightSensor1, value=newVal)
        newReading1.save()
        newReading2 = models.Reading(sensor=testlightSensor2, value=newVal)
        newReading2.save()
    testlightSensor1.lastReading = newVal
    testlightSensor2.lastReading = newVal
    testlightSensor1.save()
    testlightSensor2.save()

    testlightSwitch = models.Sensor(name="lightSwitch", description="A test sensor", coefficients="(1,0)", sensor_type="lightswitch")
    testlightSwitch.save()

    print "Creating readings for switch"
    for i in range(0, 24 * 60):
        newVal = int(math.sin(0.1 * i) + 0.5)
        newReading = models.Reading(sensor=testlightSwitch, value=newVal)
        newReading.save()
    testlightSwitch.lastReading = newVal
    testlightSwitch.save()