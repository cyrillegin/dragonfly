'''
Dragonfly
Cyrille Gindreau
2017

weatherSensor.py
Polls lascruces-weather.com and scraps for current temperature.

'''
import time
import urllib2
import requests
import json
from bs4 import BeautifulSoup as bs


def weatherSensor():
    print "Starting weather data collection!"

    readingUrl = "http://localhost:8000/api/reading"
    url = "http://www.lascruces-weather.com/"
    queryRate = 60 * 5

    print "Creating sensor"
    data = {
        "name": "weatherstation",
        "description": "Polls data from lascruces-weather.com",
        "coefficients": "1,0",
        "sensor_type": "temperature"
    }
    response = requests.post("http://localhost:8000/api/sensor", json.dumps(data))
    print response

    while(True):
        print "Finding new reading."
        page = urllib2.urlopen(url)
        soup = bs(page, 'lxml')
        for idx, val in enumerate(soup.find_all('div', class_='headerTemp')):
            temperature = val.contents[1].contents[1].contents[0][:-6]

        print "The temperature is currently: {}".format(temperature)
        newReading = {
            'sensor_name': "weatherstation",
            'value': temperature,
        }
        response = requests.post(readingUrl, json.dumps(newReading))
        print "Reading sent."
        print response
        time.sleep(queryRate)
