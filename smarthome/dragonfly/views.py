from django.shortcuts import render
import models
from rest_framework import viewsets
import serializers


def index(request):
    return render(request, 'index.html', {})


class SensorViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = models.Sensor.objects.all().order_by('-name')
    serializer_class = serializers.SensorSerializer


class ReadingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = models.Reading.objects.all()
    serializer_class = serializers.ReadingSerializer
