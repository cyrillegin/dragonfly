from django.core.management.base import BaseCommand

from dragonfly import models

import requests
import time

import serial
from os import walk
import json

from multiprocessing import Process


CommandsQueue = []


def getInfo(device):
    time.sleep(1)
    print "starting device"
    ser = serial.Serial('/dev/{}'.format(device), 9600)
    Alive = True
    pollRate = 10
    start = time.time() - pollRate
    while(Alive):
        if time.time() > start + pollRate:
            data = ser.readline()
            data = data.replace("'", '"')
            if data.startswith('["data'):
                start = time.time()
                try:
                    serData = json.loads(data)
                except Exception:
                    print "error reading data"
                print "saving data"
                for i in serData:
                    if "station" not in i:
                        print"here"
                        continue
                    print" there"
                    for j in i['sensors']:
                        try:
                            sensor = models.Sensor.objects.get(name=j['sensor'])
                        except Exception, e:
                            print "Creating new sensor"
                            print e
                            try:
                                sensor = models.Sensor(name=j['sensor'], description='mydesc', coefficients="(1,0)", sensor_type=j['type'])
                            except:
                                print "an error saving/loading sensor data"
                            sensor.save()

                        newReading = models.Reading(sensor=sensor, value=j['value'])
                        newReading.save()
        if len(CommandsQueue) > 0:
            ser.write(CommandsQueue[0])
            CommandsQueue.remove(0)


class Command(BaseCommand):
    help = 'Load a days worth of data.'

    def handle(self, *args, **options):
        pollTimer = time.time() - 10
        currentDevices = {}
        while(True):
            if time.time() > pollTimer + 10:
                pollTimer = time.time()

                f = []
                for (dirpath, dirnames, filenames) in walk("/dev/"):
                    f.extend(filenames)
                devices = []
                for i in f:
                    if i.startswith('tty.usb'):
                        devices.append(i)
                print"Devices found:"
                print devices
                for j in devices:
                    if j not in currentDevices or currentDevices[j].is_alive() is False:
                        print "New device found, starting serial: {}".format(j)
                        p = Process(target=getInfo, args=(j, ))
                        p.start()
                        currentDevices[j] = p
