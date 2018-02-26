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
import config

READINGURL = 'http://{}/api/reading'.format(config.MCPIP)

# For use on rasberry pi
USBPREFIX = 'ttyACM0'

# Foruse on OSX
# USBPREFIX = 'tty.usb'

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


def CollectData(device, sensor):
    time.sleep(1)
    logging.info("starting device")
    ser = serial.Serial('/dev/{}'.format(device), 9600)
    logging.info("Collect process starting.")
    Alive = True
    while(Alive):
        try:
            data = ser.readline().decode("utf-8")
            logging.info('received: {}'.format(data))
        except Exception as e:
            logging.error("Error reading data.")
            logging.error(e)
            time.sleep(sensor['pollRate'])
            continue
        try:
            serData = json.loads(data)
        except Exception as e:
            logging.error("Error loading data.")
            logging.error(e)
            time.sleep(sensor['pollRate'])
            continue
        if sensor['report']:
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
            try:
                response = requests.post(READINGURL, json.dumps(newReading))
                logging.debug("response was: {}".format(response))
            except Exception as e:
                logging.error("Json incorrectly formatted")
                logging.error(e)
        time.sleep(sensor['pollRate'])


def serialPoller(config):
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
                p = Process(target=CollectData, args=(j, config, ))
                p.start()
                currentDevices[j] = p
        time.sleep(pollRate)
