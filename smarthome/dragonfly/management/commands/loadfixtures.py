from django.core.management.base import BaseCommand

from dragonfly import models
import math


class Command(BaseCommand):
    help = 'Load a days worth of data.'

    def handle(self, *args, **options):
        testSense = models.Sensor(name="test1", description="A test sensor", coefficients="(1,0)")
        testSense.save()

        for i in range(0, 24 * 60):
            newVal = 400 * math.sin(0.1*i)
            print "saving: {}".format(newVal)
            newReading = models.Reading(sensor=testSense, value=newVal)
            newReading.save()
