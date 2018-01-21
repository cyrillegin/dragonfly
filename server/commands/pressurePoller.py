"""
Dragonfly
Cyrille Gindreau
2017

pressurePoller.py

Opens a sensor and sends it to Dragonfly API

"""

import json
import time
import logging
import requests

from commands.wemoSend import controlFridge
# from dragonfly import MCPIP

try:
    import Adafruit_BMP.BMP085 as BMP085
except Exception as e:
    logging.info("error loading Adafruit plugin")

READINGURL = "http://192.168.0.10:5000/api/reading"

POLL_RATE = 60


def pressurePoller():
    logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)
    logging.info("Starting presure poller.")

    while True:
        try:
            sensor = BMP085.BMP085()
            logging.info('Temp = {0:0.2f} *C'.format(sensor.read_temperature()))
        except Exception as e:
            logging.error("Couldn't create sensor.")
            logging.error(e)
        time.sleep(30)
        obj = {
            'sensor': {
                'name': 'OutdoorTemperatureTwo'
            },
            'readings': [{
                'timestamp': time.time(),
                'value': sensor.read_temperature() * 1.8 + 32,
            }]
        }
        try:
            response1 = requests.post(READINGURL, json.dumps(obj))
            logging.info("response1: {}".format(response1))
        except Exception as e:
            logging.info("error talking to server:")
            logging.info(e)
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
        try:
            response2 = requests.post(READINGURL, json.dumps(obj))
            logging.info("response2: {}".format(response2))
        except Exception as e:
            logging.info("error talking to server:")
            logging.info(e)
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
        try:
            response3 = requests.post(READINGURL, json.dumps(obj))
            logging.info("response3: {}".format(response3))
        except Exception as e:
            logging.info("error talking to server:")
            logging.info(e)
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
        try:
            response4 = requests.post(READINGURL, json.dumps(obj))
            logging.info("response4: {}".format(response4))
        except Exception as e:
            logging.info("error talking to server:")
            logging.info(e)
        time.sleep(POLL_RATE)
