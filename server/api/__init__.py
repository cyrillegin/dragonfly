'''
Dragonfly
Cyrille Gindreau
2017

__init__.py

Setup for api

'''
from api.reading import Readings
from api.sensor import Sensors
from api.log import Logs
from api.grafana import GrafanaApi
from api.camera import Camera


class ResourceApi:

    sensor = Sensors()
    reading = Readings()
    log = Logs()
    grafana = GrafanaApi()
    camera = Camera()
