from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import viewsets, permissions
from django.views.generic import View

import json

from dragonfly.permission import IsOwnerOrReadOnly
from dragonfly.models import Sensor
from dragonfly.serializers import SensorSerializer


class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
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

        return render(request, 'index.html', {})


class addSensor(View):
    def post(self, request):
        data = json.loads(request.body)
        print data

        return render(request, 'index.html', {})
