
import loadfixtures
import serialPoller
import weatherSensor


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
