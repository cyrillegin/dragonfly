'''
Dragonfly
Cyrille Gindreau
2017

__init__.py

Setup for api

'''
from reading import Readings
from sensor import Sensors
from log import Logs
from grafana import GrafanaApi
from camera import Camera


class ResourceApi:

    sensor = Sensors()
    reading = Readings()
    log = Logs()
    grafana = GrafanaApi()
    camera = Camera()
