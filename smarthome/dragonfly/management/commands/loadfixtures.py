from django.core.management.base import BaseCommand

from dragonfly import models
import math
import datetime


class Command(BaseCommand):
    help = 'Load a days worth of data.'

    def handle(self, *args, **options):
        testTemp1 = models.Sensor(name="waterTemp", description="A test sensor", coefficients="(1,0)", sensor_type="temperature")
        testTemp1.save()

        testTemp2 = models.Sensor(name="waterTurb", description="A test sensor", coefficients="(1,0)", sensor_type="temperature")
        testTemp2.save()
        print "Creating readings for temp and turb"
        for i in range(0, 24 * 60):
            newVal = 60 + 30 * math.sin(0.1 * i)
            newReading1 = models.Reading(sensor=testTemp1, value=newVal)
            newReading1.save()
            newReading2 = models.Reading(sensor=testTemp2, value=newVal)
            newReading2.save()

        testCleanliness = models.Sensor(name="aquaLight", description="A test sensor", coefficients="(1,0)", sensor_type="cleanliness")
        testCleanliness.save()

        print "Creating readings for aqua light"
        for i in range(0, 24 * 60):
            newVal = 50 + 50 * math.sin(0.1 * i)
            newReading = models.Reading(sensor=testCleanliness, value=newVal)
            newReading.save()

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

        testlightSwitch = models.Sensor(name="lightSwitch", description="A test sensor", coefficients="(1,0)", sensor_type="lightswitch")
        testlightSwitch.save()

        print "Creating readings for switch"
        for i in range(0, 24 * 60):
            newVal = int(math.sin(0.1 * i) + 0.5)
            newReading = models.Reading(sensor=testlightSwitch, value=newVal)
            newReading.save()
