from django.core.management.base import BaseCommand

from dragonfly import models
import os
import django
import sys

import requests
import json
import time


class Command(BaseCommand):
    help = 'Load a days worth of data.'

    def handle(self, *args, **options):

        print "Starting weather data collection!"
        print "Finding sensor."
        try:
            sensor = models.Sensor.objects.get(name="weatherstation")
            print "Sensor Found!"
        except Exception, e:
            print "Exception: {}".format(e)
            print "Creating new Sensor"
            sensor = models.Sensor(name="weatherstation", description="Polls weather data from openweathermap.org", coefficients="(1,0)")
            sensor.save()
        url = "http://api.openweathermap.org/data/2.5/forecast/city?id=5475352&APPID=f782c6debe8a02e649cb61cd1415f606"
        queryRate = 60 * 5
        while(True):
            print "Getting a new reading."
            data = requests.get(url)
            temperature = data.json()['list'][0]['main']['temp'] * (9.0 / 5.0) - 469.67
            print "The temperature is currently: {}".format(temperature)
            newReading = models.Reading(sensor=sensor, value=temperature)
            newReading.save()
            print "Reading saved."
            time.sleep(queryRate)
