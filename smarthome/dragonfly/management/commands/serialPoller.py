from django.core.management.base import BaseCommand

from dragonfly import models

import time

import serial
from os import walk
import json

from multiprocessing import Process


def MCP(device):
    time.sleep(1)
    print "starting device"
    ser = serial.Serial('/dev/{}'.format(device), 9600)
    p1 = Process(target=CollectData, args=(ser, ))
    p1.start()
    p2 = Process(target=SendData, args=(ser, ))
    p2.start()


def CollectData(ser):
    print "collect process starting"
    Alive = True
    pollRate = 60
    while(Alive):
        try:
            # data = ser.readline()
        except:
            print "error reading data."
            Alive = False
            continue
        data = data.replace("'", '"')
        if data.startswith('["data'):
            try:
                serData = json.loads(data)
            except Exception:
                print "error loading data"
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
                        try:
                            sensor = models.Sensor(name=j['sensor'], description='mydesc', coefficients="(1,0)", sensor_type=j['type'])
                        except:
                            print "an error saving/loading sensor data"
                            continue
                        sensor.save()
                    try:
                        newReading = models.Reading(sensor=sensor, value=j['value'])
                        newReading.save()
                        continue
                    except:
                        print "error saving new readings"
        time.sleep(pollRate)


def SendData(ser):
    print "send process starting"
    CheckRate = 1
    while(True):
        FoundData = False
        try:
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
        except:
            print "error opening json file."
        if(FoundData):
            try:
                with open('commandQueue.json', 'w') as outfile:
                    print "command complete"
                    json.dump({}, outfile)
                    FoundData = False
            except:
                print "error writing to json file."
        time.sleep(CheckRate)


class Command(BaseCommand):
    help = 'Load a days worth of data.'

    def handle(self, *args, **options):
        # poll every 1 minute
        pollRate = 60
        currentDevices = {}
        while(True):
            f = []
            for (dirpath, dirnames, filenames) in walk("/dev/"):
                f.extend(filenames)
            devices = []
            for i in f:
                if i.startswith('ttyUSB'):
                    devices.append(i)
            print"Devices found: {}".format(devices)
            for j in devices:
                if j not in currentDevices or currentDevices[j].is_alive() is False:
                    print "New device found, starting serial: {}".format(j)
                    p = Process(target=MCP, args=(j, ))
                    p.start()
                    currentDevices[j] = p
            time.sleep(pollRate)
