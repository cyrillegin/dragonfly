"""

Dragonfly
Cyrille Gindreau
2017

__init__.py

Sets up commands that are run from run.py

"""
import loadfixtures
import serialPoller
import weatherSensor
import imageCapture
import GpioPoller
import pressurePoller
import oneWireSensor


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
    def FishCam():
        imageCapture.recordImages()

    @staticmethod
    def GpioPoller():
        GpioPoller.GpioPoller()

    @staticmethod
    def PressurePoller():
        pressurePoller.pressurePoller()

    @staticmethod
    def OneWirePoller():
        oneWireSensor.ReadOneWire()
