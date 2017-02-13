import models
from rest_framework import serializers


class SensorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Sensor
        fields = ('name', 'coefficients', 'units')


class ReadingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Reading
        fields = ('value', 'time_stamp', 'sensor')
