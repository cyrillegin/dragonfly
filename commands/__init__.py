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
import databaseCommands
import createUser


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

    @staticmethod
    def Backup():
        databaseCommands.BackupDatabase()

    @staticmethod
    def Refresh():
        databaseCommands.RefreshDatabase()

    @staticmethod
    def CreateUser():
        createUser.CreateSuperuser()

    @staticmethod
    def ChangePassword():
        createUser.ChangePassword()
