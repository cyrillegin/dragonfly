
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
from dragonfly import MCPIP

DEVICE_ID = "28-0516a49158ff"
DEVICE_LOCATION = "/sys/bus/w1/devices/{}/w1_slave".format(DEVICE_ID)

READINGURL = "http://{}:5000/api/reading".format(MCPIP)

POLL_RATE = 60 * 5

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)
logging.info("Starting presure poller.")


os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')


def temp_raw():

    f = open(DEVICE_LOCATION, 'r')
    lines = f.readlines()
    f.close()
    return lines


def read_temp():

    lines = temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = temp_raw()

    temp_output = lines[1].find('t=')

    if temp_output != -1:
        temp_string = lines[1].strip()[temp_output+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = temp_c * 9.0 / 5.0 + 32.0

        obj = {
            'sensor': {
                'name': 'kitchen-temperature'
            },
            'readings': [{
                'timestamp': time.time(),
                'value': temp_f,
            }]
        }
        try:
            response = requests.post(READINGURL, json.dumps(obj))
            logging.info("Sent {} to station".format(response))
        except Exception, e:
            print "error talking to server:"
            print e

        return temp_c, temp_f


def ReadOneWire():
    while True:
        read_temp()
        time.sleep(POLL_RATE)
