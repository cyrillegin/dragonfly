from rest_framework import serializers
from dragonfly.models import Sensor


class SensorSerializer(serializers.HyperlinkedModelSerializer):
    readings = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Sensor
        fields = ('url', 'id',
                  'created', 'name', 'description', 'coefficients', 'readings')
