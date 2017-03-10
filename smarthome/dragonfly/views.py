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
        print data
        print "were here"
        try:
            print "name is: {}".format(data['sensor'])
            sensor = models.Sensor.objects.get(name=data['sensor'])
            print "we found the sensor:"
            # print json.dumps(sensor.toDict(), indent=2)
        except:
            return render(request, 'index.html', {'error': 'sensor not found'})
        newReading = models.Reading(sensor=sensor, value=data['value'], created=data['date'])
        newReading.save()
        print "were done"
        return render(request, 'index.html', {})


class addSensor(View):
    def post(self, request):
        data = json.loads(request.body)
        print data
        print "were here!!"
        newSensor = models.Sensor(name=data['name'], description=data['description'], coefficients=data['coefficients'], sensor_type=data['sensor_type'], units=data['units'])
        newSensor.save()
        return render(request, 'index.html', {})


class getReadings(View):
    def get(self, request):
        startDate = datetime.today() - timedelta(days=1)
        endDate = datetime.today()
        if 'start-date' in self.kwargs:
            startDate = self.kwargs['start-date']
        if 'end-date' in self.kwargs:
            endDate = self.kwargs['end-date']
        print startDate
        print endDate

        data = {}

        sensors = models.Sensor.objects.all()
        for i in sensors:
            sensor = i.toDict()
            readings = models.Reading.objects.filter(sensor=i).filter(created__range=[startDate, endDate])
            data[sensor['name']] = sensor
            data[sensor['name']]['readings'] = []
            for i in readings:
                data[sensor['name']]['readings'].append(i.toDict())
        print data

        return JsonResponse(data)







