
"""
Setup:
add 'dtoverlay=w1-gpio' (noquotes)
to /boot/config.txt

turn on modules:
`sudo modprobe w1-gpio`
`sudo modprobe w1-therm`

`ls /sys/bus/w1/devices/``
you will see a device id in the form of:
    28-0516a49158ff
copy this and paste it for DEVICE_ID.

code and hardware setup  adapted from:
https://www.modmypi.com/blog/ds18b20-one-wire-digital-temperature-sensor-and-the-raspberry-pi

"""

import os
import time
import json
import requests
import logging
from commands.wemoSend import controlFridge
from commands.controller import sendEvent
from config import MCPIP
from config import MCPPORT


READINGURL = "http://{}:{}/api/reading".format(MCPIP, MCPPORT)


def readTemperature(deviceLocation):

    f = open(deviceLocation, 'r')
    lines = f.readlines()
    f.close()
    return lines


def ReadOneWire(params):
    logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)
    logging.info("Starting presure poller.")

    os.system('modprobe w1-gpio')
    os.system('modprobe w1-therm')
    deviceLocation = "/sys/bus/w1/devices/{}/w1_slave".format(params['deviceId'])
    on = False
    while True:
        lines = readTemperature(deviceLocation)
        while lines[0].strip()[-3:] != 'YES':
            time.sleep(0.2)
            lines = readTemperature(deviceLocation)

        temp_output = lines[1].find('t=')

        if temp_output != -1:
            temp_string = lines[1].strip()[temp_output+2:]
            temp_c = float(temp_string) / 1000.0
            temp_f = temp_c * 9.0 / 5.0 + 32.0

            logging.info('Temperature is currently: {}'.format(temp_f))
            if params['report']:
                obj = {
                    'sensor': {
                        'name': params['sensorName']
                    },
                    'readings': [{
                        'timestamp': time.time(),
                        'value': temp_f,
                    }]
                }
                try:
                    response = requests.post(READINGURL, json.dumps(obj))
                    logging.info("Sent {} to station".format(response))
                except Exception as e:
                    logging.info("error talking to server:")
                    logging.info(e)
        for command in params['controls']:
            for event in command['events']:
                if event['operator'] == 'greaterThan':
                    if temp_f > event['condition']:
                        sendEvent(command['controller'], event['command'])
                if event['operator'] == 'lessThan':
                    if temp_f < event['condition']:
                        sendEvent(command['controller'], event['command'])
        if params['pollRate'] is 0:
            break
        time.sleep(params['pollRate'])
