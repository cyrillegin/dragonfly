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
from command import Command
from user import Users
from grafana import GrafanaApi


class ResourceApi:

    sensor = Sensors()
    reading = Readings()
    log = Logs()
    command = Command()
    user = Users()
    grafana = GrafanaApi()
