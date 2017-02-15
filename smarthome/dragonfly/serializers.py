import models
from rest_framework import serializers


class SensorSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(required=False, allow_blank=True, max_length=100)
    coefficients = serializers.CharField(required=False, allow_blank=True, max_length=10)
    units = serializers.CharField(required=False, allow_blank=True, max_length=20)

    def create(self, validated_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        print "\nCreating\n"
        return models.Sensor.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Snippet` instance, given the validated data.
        """
        instance.name = validated_data.get('name', instance.name)
        instance.coefficients = validated_data.get('coefficients', instance.coefficients)
        instance.units = validated_data.get('units', instance.units)
        instance.save()
        print "\nUpdating\n"
        return instance

    class Meta:
        model = models.Sensor
        fields = ('id', 'name', 'coefficients', 'units')


class ReadingSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    value = serializers.FloatField()
    time_stamp = serializers.DateTimeField(required=False)
    sensor = serializers.PrimaryKeyRelatedField(queryset=models.Sensor.objects.all())

    def create(self, validated_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        print "\nCreating\n"
        return models.Reading.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Snippet` instance, given the validated data.
        """
        print "there"
        instance.value = validated_data.get('value', instance.value)
        instance.time_stamp = validated_data.get('time_stamp', instance.time_stamp)
        instance.sensor = validated_data.get('sensor', instance.sensor)
        instance.save()
        print "\nUpdating\n"
        return instance

    class Meta:
        model = models.Reading
        fields = ('id', 'value', 'time_stamp', 'sensor')
