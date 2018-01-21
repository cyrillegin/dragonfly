"""

Dragonfly
Cyrille Gindreau
2017

__init__.py

Sets up commands that are run from run.py

"""
import commands.loadfixtures
import commands.serialPoller
import commands.weatherSensor
import commands.imageCapture
import commands.GpioPoller
import commands.pressurePoller
import commands.oneWireSensor


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
    def OneWirePoller(deviceId, deviceName, pollRate, report):
        oneWireSensor.ReadOneWire(deviceId, deviceName, pollRate, report)
