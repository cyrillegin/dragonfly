from rest_framework import serializers
from dragonfly.models import Sensor, Reading


class ReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reading
        fields = ('created', 'value')


class SensorSerializer(serializers.HyperlinkedModelSerializer):
    readings = ReadingSerializer(many=True, read_only=True)

    class Meta:
        model = Sensor
        fields = ('url', 'id',
                  'created', 'name', 'description', 'coefficients', 'readings', 'sensor_type')
