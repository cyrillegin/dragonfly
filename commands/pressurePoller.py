'''
Dragonfly
Cyrille Gindreau
2017

pressurePoller.py

Opens a sensor and sends it Dragonfly API

'''

import json
import requests
import logging
import time
import Adafruit_BMP.BMP085 as BMP085

READINGURL = "http://192.168.0.3:5000/api/reading"
POLL_RATE = 60 * 5


def pressurePoller():
    logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)
    logging.info("Starting presure poller.")

    while(True):
        try:
            sensor = BMP085.BMP085()
        except Exception, e:
            logging.error("Couldn't create sensor.")
            logging.error(e)

        logging.info('Temp = {0:0.2f} *C'.format(sensor.read_temperature()))
        obj = {
            'sensor': {
                'name': 'OutdoorTemperatureTwo'
            },
            'readings': [{
                'timestamp': time.time(),
                'value': sensor.read_temperature() * 1.8 + 32,
            }]
        }
        response1 = requests.post(READINGURL, json.dumps(obj))
        logging.info('Pressure = {0:0.2f} Pa'.format(sensor.read_pressure()))
        obj = {
            'sensor': {
                'name': 'OutdoorPressure'
            },
            'readings': [{
                'timestamp': time.time(),
                'value': sensor.read_pressure(),
            }]
        }
        response2 = requests.post(READINGURL, json.dumps(obj))
        logging.info('Altitude = {0:0.2f} m'.format(sensor.read_altitude()))
        obj = {
            'sensor': {
                'name': 'OutdoorAltitude'
            },
            'readings': [{
                'timestamp': time.time(),
                'value': sensor.read_altitude() * 3.28084,
            }]
        }
        response3 = requests.post(READINGURL, json.dumps(obj))
        logging.info('Sealevel Pressure = {0:0.2f} Pa'.format(sensor.read_sealevel_pressure()))
        obj = {
            'sensor': {
                'name': 'OutdoorSealevelPressure'
            },
            'readings': [{
                'timestamp': time.time(),
                'value': sensor.read_sealevel_pressure(),
            }]
        }
        response4 = requests.post(READINGURL, json.dumps(obj))
        logging.info("responses: {}, {}, {}, {}".format(response1, response2, response3, response4))
        time.sleep(POLL_RATE)
