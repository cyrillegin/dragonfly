from django.core.management.base import BaseCommand

from dragonfly import models
import math


class Command(BaseCommand):
    help = 'Load a days worth of data.'

    def handle(self, *args, **options):
        testTemp = models.Sensor(name="test1", description="A test sensor", coefficients="(1,0)", sensor_type="temperature")
        testTemp.save()

        for i in range(0, 24 * 60):
            newVal = 60 + 30 * math.sin(0.1 * i)
            print "saving: {}".format(newVal)
            newReading = models.Reading(sensor=testTemp, value=newVal)
            newReading.save()

        testCleanliness = models.Sensor(name="test1", description="A test sensor", coefficients="(1,0)", sensor_type="cleanliness")
        testCleanliness.save()

        for i in range(0, 24 * 60):
            newVal = 50 + 50 * math.sin(0.1 * i)
            print "saving: {}".format(newVal)
            newReading = models.Reading(sensor=testCleanliness, value=newVal)
            newReading.save()

        testlightSensor = models.Sensor(name="test1", description="A test sensor", coefficients="(1,0)", sensor_type="lightsensor")
        testlightSensor.save()

        for i in range(0, 24 * 60):
            newVal = 500 + 500 * math.sin(0.1 * i)
            print "saving: {}".format(newVal)
            newReading = models.Reading(sensor=testlightSensor, value=newVal)
            newReading.save()

        for i in range(0, 24 * 60):
            newVal = int(math.sin(0.1 * i) + 0.5)
            print "saving: {}".format(newVal)
            newReading = models.Reading(sensor=testlightSensor, value=newVal)
            newReading.save()
