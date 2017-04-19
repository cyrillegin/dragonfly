'''
Dragonfly
Cyrille Gindreau
2017

__init__.py

Sets up commands that are run from run.py

'''
import loadfixtures
import serialPoller
import weatherSensor
import automate


class Command:
    @staticmethod
    def LoadFixtures():
        loadfixtures.loadfixtures()

    @staticmethod
    def SerialPoller():
        serialPoller.serialPoller()

    @staticmethod
    def WeatherSensor():
        weatherSensor.weatherSensor()

    @staticmethod
    def Automate():
        automate.automate()