from django.shortcuts import render
import models
from rest_framework import viewsets
import serializers

from django.http import HttpResponse
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view


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
    print"here"
    queryset = models.Reading.objects.all()
    serializer_class = serializers.ReadingSerializer


class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


@api_view(['GET', 'POST'])
def sensor_list(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        sensors = models.Sensor.objects.all()
        serializer = serializers.SensorSerializer(sensors, many=True)
        return JSONResponse(serializer.data)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = serializers.SensorSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data, status=201)
        return JSONResponse(serializer.errors, status=400)


@api_view(['GET', 'POST'])
def reading_list(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        readings = models.Reading.objects.all()
        serializer = serializers.SensorSerializer(readings, many=True)
        return JSONResponse(serializer.data)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = serializers.ReadingSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data, status=201)
        return JSONResponse(serializer.errors, status=400)
