import logging
import subprocess
from os import walk
import serial


logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)

USBPREFIX = 'tty.usbmodem14101'


def TakeAction(action, value, sensor):
    logging.info("taking action")
    device = ''
    for (dirpath, dirnames, filenames) in walk("/dev/"):
        for path in filenames:
            if path.startswith(action['meta']):
                device = path
    logging.info("device: " + device)
    i = (int) value
    print i
    # ser = serial.Serial('/dev/ttyUSB0')
    # ser.write(value)
    # ser.close()
