from django.core.management.base import BaseCommand

from dragonfly import models

import time

import serial
from os import walk
import json

from multiprocessing import Process


def getInfo(device):
    time.sleep(1)
    print "starting device"
    ser = serial.Serial('/dev/{}'.format(device), 9600)
    Alive = True
    pollRate = 10
    start = time.time() - pollRate
    while(Alive):
        if time.time() > start + pollRate:
            try:
                data = ser.readline()
            except:
                print "error reading data."
                Alive = False
                continue
            data = data.replace("'", '"')
            if data.startswith('["data'):
                start = time.time()
                try:
                    serData = json.loads(data)
                except Exception:
                    print "error loading data"
                    Alive = False
                    continue
                print "saving data"
                for i in serData:
                    if "station" not in i:
                        continue
                    for j in i['sensors']:
                        try:
                            sensor = models.Sensor.objects.get(name=j['sensor'])
                        except Exception, e:
                            print "Creating new sensor"
                            print e
                            Alive = False
                            try:
                                sensor = models.Sensor(name=j['sensor'], description='mydesc', coefficients="(1,0)", sensor_type=j['type'])
                            except:
                                print "an error saving/loading sensor data"
                                Alive = False
                                continue
                            sensor.save()

                        newReading = models.Reading(sensor=sensor, value=j['value'])
                        newReading.save()
            FoundData = False
            with open('commandQueue.json') as data_file:
                data = json.load(data_file)
                if(len(data.keys()) > 0):
                    print "got new command!"
                    print data
                    if(data['value'] is True):
                        ser.write('1')
                    else:
                        ser.write('0')
                    FoundData = True
            if(FoundData):
                with open('commandQueue.json', 'w') as outfile:
                    print "command complete"
                    json.dump({}, outfile)
                    FoundData = False


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
