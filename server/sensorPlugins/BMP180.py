"""
Dragonfly
Cyrille Gindreau
2017
BMP180.py
"""

import time
import logging

try:
    import Adafruit_BMP.BMP085 as BMP085
except Exception as e:
    logging.info("error loading Adafruit plugin")

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


def GetValues(params):

    logging.info("Starting presure poller.")

    try:
        sensor = BMP085.BMP085()
        logging.info('Temp = {0:0.2f} *C'.format(sensor.read_temperature()))
    except Exception as e:
        logging.error("Couldn't create sensor.")
        logging.error(e)
    newReading = {
        'sensor': {
            'uuid': params['uuid'],
            'poller': 'bmp180'
        },
        'readings': {
            'timestamp': time.time() * 1000,
        }
    }
    if 'meta' in params:
        if params['meta'] == 'pressure':
            newReading['readings']['value'] = sensor.read_pressure()
        elif params['meta'] == 'altitude':
            newReading['readings']['value'] = sensor.read_altitude() * 3.28084
        elif params['meta'] == 'seaLevelPressure':
            newReading['readings']['value'] = sensor.read_sealevel_pressure()
        elif params['meta'] == 'temperature':
            newReading['readings']['value'] = sensor.read_temperature() * 1.8 + 32
    logging.info("reading is: {}".format(newReading['readings']['value']))
    return newReading
