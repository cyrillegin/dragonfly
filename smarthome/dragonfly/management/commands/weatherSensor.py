from django.core.management.base import BaseCommand
from dragonfly import models
import time
import urllib2
from bs4 import BeautifulSoup as bs


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
            sensor = models.Sensor(name="weatherstation", description="Polls weather data from openweathermap.org", coefficients="(1,0)", sensor_type='temperature')
            sensor.save()
        url = "http://www.lascruces-weather.com/"
        queryRate = 60 * 5
        while(True):
            print "Getting a new reading."
            page = urllib2.urlopen(url)
            soup = bs(page, 'lxml')
            for idx, val in enumerate(soup.find_all('div', class_='headerTemp')):
                temperature = val.contents[1].contents[1].contents[0][:-6]

            print "The temperature is currently: {}".format(temperature)
            newReading = models.Reading(sensor=sensor, value=temperature)
            newReading.save()
            print "Reading saved."
            time.sleep(queryRate)
