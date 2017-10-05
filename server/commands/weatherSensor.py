"""
Dragonfly
Cyrille Gindreau
2017

weatherSensor.py
Polls lascruces-weather.com and scraps for current temperature.

"""

import time
import urllib2
import requests
import json
import logging
from bs4 import BeautifulSoup as bs
from dragonfly import MCPIP

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)

READINGURL = "http://{}:5000/api/reading".format(MCPIP)
SENSORURL = "http://{}:5000/api/sensor".format(MCPIP)


def weatherSensor():
    logging.info("Starting weather data collection.")

    url = "http://www.lascruces-weather.com/"
    queryRate = 60 * 5

    logging.info("Creating sensor.")
    data = {
        "name": "weatherstation",
        "description": "Polls data from lascruces-weather.com",
        "coefficients": "1,0",
        "sensor_type": "temperature"
    }
    sensor = requests.post(SENSORURL, json.dumps(data))
    logging.debug(sensor)

    while(True):
        logging.info("Finding new reading.")
        page = urllib2.urlopen(url)
        soup = bs(page, 'lxml')
        for idx, val in enumerate(soup.find_all('div', class_='headerTemp')):
            temperature = val.contents[1].contents[1].contents[0][:-6]

        logging.info("The temperature is currently: {}".format(temperature))
        newReading = {
            'sensor': {
                'name': "weatherstation"
            },
            'readings': [{
                'value': temperature,
                'timestamp': time.time()
            }]
        }
        response = requests.post(READINGURL, json.dumps(newReading))
        logging.info("Reading sent.")
        logging.debug(response)
        time.sleep(queryRate)
