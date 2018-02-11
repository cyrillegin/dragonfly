import logging
import time

from commands import motionSensor
from commands import oneWireSensor
from commands import serialPoller
from commands import cryptoPoller

from multiprocessing import Process
from config import CHECK_RATE


def startPollers(config):
    print 'here'
    runningSensors = []
    for j in range(len(config)):
        runningSensors.append(None)
    while True:
        logging.info('Checking sensors')
        print (runningSensors)
        for i in range(len(config)):
            if runningSensors[i] is not None and runningSensors[i].is_alive():
                continue
            if config[i]['poller'] == 'MotionPoller':
                func = handleMotionSensor
            if config[i]['poller'] == 'OneWire':
                func = handleWireSensor
            if config[i]['poller'] == 'Serial':
                func = handleSerialPoller
            if config[i]['poller'] == 'Crypto':
                func = handleCryptoPoller
            p = Process(target=func, args=(config[i], ))
            p.start()
            runningSensors[i] = p
        time.sleep(CHECK_RATE)


def handleMotionSensor(sensor):
    logging.info('starting motion sensor with config:')
    logging.info(sensor)
    try:
        motionSensor.ReadMotion(sensor)
    except Exception as e:
        logging.info('Motion sensor quitting')
        logging.info(e)

def handleWireSensor(sensor):
    logging.info('Starting wire sensor with config:')
    logging.info(sensor)
    try:
        oneWireSensor.ReadOneWire(sensor)
    except Exception as e:
        logging.info('One wire sensor quitting')
        logging.info(e)

def handleSerialPoller(sensor):
    logging.info('Starting wire sensor with config:')
    logging.info(sensor)
    try:
        serialPoller.serialPoller(sensor)
    except Exception as e:
        logging.info("Serial poller quitting.")
        logging.info(e)

def handleCryptoPoller(sensor):
    logging.info('Starting Crypto poller')
    logging.info(sensor)
    try:
        cryptoPoller.GetValues(sensor)
    except Exception as e:
        logging.info('Crypto poller quitting')
        logging.info(e)
