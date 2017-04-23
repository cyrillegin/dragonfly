'''
Dragonfly
Cyrille Gindreau
2017

serialPoller.py

Walks dev directory searching for usb devices.
Once found, starts new process to collect and send data.


'''
from multiprocessing import Process
from os import walk
import time
import serial
import json
import requests

SENSORURL = "https://dragonf1y.herokuapp.com/api/sensor"
READINGURL = "https://dragonf1y.herokuapp.com/api/reading"

# For use on rasberry pi
USBPREFIX = 'ttyUSB'

# Foruse on OSX
# USBPREFIX = 'tty.usb'


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
    pollRate = 20
    while(Alive):
        try:
            data = ser.readline()
        except:
            print "error reading data."
            Alive = False
            continue
        data = data.replace("'", '"')
        if data.startswith('["data'):
            try:
                serData = json.loads(data)
            except Exception, e:
                print "error loading data"
                print e
                continue
            print "saving data"
            for i in serData:
                if "station" not in i:
                    print 'discarding'
                    continue
                for j in i['sensors']:
                    newReading = {
                        'sensor': {
                            'name': j['sensor']
                        },
                        'readings': [{
                            'timestamp': time.time(),
                            'value': j['value']
                        }]
                    }
                    print "saving:"
                    print newReading
                    response = requests.post(READINGURL, json.dumps(newReading))
                    print "response was: {}".format(response)
        else:
            print "data not formatted correctly, sleeping."
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


def serialPoller():
        # poll every 1 minute
        pollRate = 60
        currentDevices = {}
        while(True):
            f = []
            for (dirpath, dirnames, filenames) in walk("/dev/"):
                f.extend(filenames)
            devices = []
            for i in f:
                if i.startswith(USBPREFIX):
                    devices.append(i)
            print"Devices found: {}".format(devices)
            for j in devices:
                if j not in currentDevices or currentDevices[j].is_alive() is False:
                    print "New device found, starting serial: {}".format(j)
                    p = Process(target=MCP, args=(j, ))
                    p.start()
                    currentDevices[j] = p
            time.sleep(pollRate)
