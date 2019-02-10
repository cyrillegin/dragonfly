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
    logging.info("device: ")
    logging.info("/dev/{}".format(device))
    ser = serial.Serial("/dev/{}".format(device))
    print("conn made")
    print(ser)
    ser.write(bytes([int(value)]))
    print("closing conn")
    ser.close()
    print("all done")
