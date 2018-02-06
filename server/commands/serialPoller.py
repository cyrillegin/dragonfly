"""
Dragonfly
Cyrille Gindreau
2017

serialPoller.py

Walks dev directory searching for usb devices.
Once found, starts new process to collect and send data.


"""
from multiprocessing import Process
from os import walk
import time
import serial
import json
import requests
import logging
from config import SENSORS

SENSORURL = "http://192.168.0.10:5000/api/sensor"
READINGURL = "http://192.168.0.10:5000/api/reading"

# For use on rasberry pi
# USBPREFIX = 'ttyUSB'

# Foruse on OSX
USBPREFIX = 'tty.usb'

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


def MCP(device):
    time.sleep(1)
    logging.info("starting device")
    ser = serial.Serial('/dev/{}'.format(device), 9600)
    p1 = Process(target=CollectData, args=(ser, ))
    p1.start()
    p2 = Process(target=SendData, args=(ser, ))
    p2.start()


def CollectData(ser):
    logging.info("Collect process starting.")
    Alive = True
    pollRate = SENSORS
    while(Alive):
        try:
            data = ser.readline()
            print data
        except Exception as e:
            logging.error("Error reading data.")
            logging.debug(e)
            time.sleep(pollRate)
            continue

        try:
            serData = json.loads(data)
        except Exception as e:
            logging.error("Error loading data.")
            logging.debug(e)
            time.sleep(pollRate)
            continue
        logging.info("saving data")
        try:
            newReading = {
                'sensor': {
                    'name': serData['sensor']['name']
                },
                'readings': [{
                    'timestamp': time.time(),
                    'value': serData['sensor']['value'] / 100
                }]
            }
            logging.info("Saving: {}".format(newReading))
            response = requests.post(READINGURL, json.dumps(newReading))
            logging.debug("response was: {}".format(response))
        except Exception as e:
            logging.info("Json incorrectly formatted")
        time.sleep(pollRate)


def serialPoller(config):
    print config
    return
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
        logging.info("Devices found: {}".format(devices))
        for j in devices:
            if j not in currentDevices or currentDevices[j].is_alive() is False:
                logging.info("New device found, starting serial: {}".format(j))
                p = Process(target=MCP, args=(j, ))
                p.start()
                currentDevices[j] = p
        time.sleep(pollRate)
