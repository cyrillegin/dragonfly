from __future__ import unicode_literals

from django.db import models


class Sensor(models.Model):
    name = models.CharField(max_length=100)
    coefficients = models.CharField(max_length=10)
    units = models.CharField(max_length=20)

    # def __str__(self):
    #     return "name: {}, coefficients: {}, units: {}".format(self.name, self.coefficients, self.units)

    class Meta:
        ordering = ('name',)


class Reading(models.Model):
    value = models.FloatField()
    time_stamp = models.DateTimeField()
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE)

    # def __str__(self):
    #     return "value: {}, time-stamp: {}, sensor-name: {}".format(self.value, self.time_stamp, self.sensor.name)

    class Meta:
        ordering = ('time_stamp',)
