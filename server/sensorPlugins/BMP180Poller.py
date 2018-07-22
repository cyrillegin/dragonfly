"""
Dragonfly
Cyrille Gindreau
2017
BMP180.py
"""

import time
import logging

from vendor import BMP180

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


def GetValues(params):

    logging.info("Starting presure poller.")

    value = None
    try:
        sensor = BMP180.BMP180()
        print('reading value')
        print(params)
        if params['meta'] == 'temperature':
            value = sensor.read_temperature() * 9.0 / 5.0 +32
        elif params['meta'] == 'pressure':
            value = sensor.read_pressure() / 100.0
        elif params['meta'] == 'altitude':
            value = sensor.read_altitude()
    except Exception as e:
        logging.error("Couldn't create sensor.")
        logging.error(e)
        return {}
    print('creating reading')
    newReading = {
        'sensor': {
            'uuid': params['uuid'],
            'poller': 'bmp180'
        },
        'readings': {
            'timestamp': time.time() * 1000,
            'value': value
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
