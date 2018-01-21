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
import commands.motionSensor


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
    def OneWirePoller(params):
        oneWireSensor.ReadOneWire(params)

    @staticmethod
    def MotionPoller(params):
        motionSensor.ReadMotion(params)
