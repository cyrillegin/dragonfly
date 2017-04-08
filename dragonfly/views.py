from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import viewsets, permissions
from django.views.generic import View
from django.http import JsonResponse

import json
from datetime import datetime, timedelta

from dragonfly.permission import IsOwnerOrReadOnly
from dragonfly import models
from dragonfly.serializers import SensorSerializer, LogSerializer


class SensorViewSet(viewsets.ModelViewSet):
    queryset = models.Sensor.objects.all()
    serializer_class = SensorSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class LogViewSet(viewsets.ModelViewSet):
    queryset = models.Log.objects.all()
    serializer_class = LogSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'sensors': reverse('sensor-list', request=request, format=format)
    })


class index(View):
    def get(self, request):
        return render(request, 'index.html', {})

    def post(self, request):
        print "\nwe were given some info!\n"
        print request


class sendData(View):
    def post(self, request):
        data = json.loads(request.body)
        # print data
        with open('commandQueue.json', 'w') as outfile:
            json.dump(data, outfile)
        return render(request, 'index.html', {})


class addReading(View):
    def post(self, request):
        data = json.loads(request.body)
        try:
            sensor = models.Sensor.objects.get(name=data['sensor'])
        except:
            return render(request, 'index.html', {'error': 'sensor not found'})
        newReading = models.Reading(sensor=sensor, value=data['value'], created=data['date'])
        newReading.save()
        sensor.lastReading = data['value']
        sensor.save()
        return render(request, 'index.html', {})


class addSensor(View):
    def post(self, request):
        data = json.loads(request.body)
        newSensor = models.Sensor(name=data['name'], description=data['description'], coefficients=data['coefficients'], sensor_type=data['sensor_type'], units=data['units'])
        newSensor.save()
        return render(request, 'index.html', {})


class addLog(View):
    def post(self, request):
        data = json.loads(request.body)
        newLog = models.Log(title=data['title'], description=data['description'])
        newLog.save()
        return render(request, 'index.html', {})


class getSensors(View):
    def get(self, request):
        sensors = models.Sensor.objects.all()
        data = {'sensors': []}
        for i in sensors:
            data['sensors'].append(i.toDict())
        return JsonResponse(data)


class getReadings(View):
    def post(self, request):
        data = json.loads(request.body)
        startDate = datetime.today() - timedelta(days=1)
        endDate = datetime.today() + timedelta(days=1)
        if 'start-date' in data:
            startDate = data['start-date']
        if 'end-date' in data:
            endDate = data['end-date']

        sensorObj = models.Sensor.objects.filter(name=data['sensor'])[0]
        readings = models.Reading.objects.filter(sensor=sensorObj, created__range=[startDate, endDate])
        toReturn = {
            'sensor': sensorObj.toDict(),
            'readings': []
        }
        readings = SlimReadings(readings)
        for i in readings:
            toReturn['readings'].append(i.toDict())

        return JsonResponse(toReturn)


def SlimReadings(data):
    toReturn = []
    count = 0
    for i in data:
        count += 1
        if count % 2 == 0:
            toReturn.append(i)
    return toReturn





