from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import viewsets, permissions

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


def index(request):
    return render(request, 'index.html', {})
