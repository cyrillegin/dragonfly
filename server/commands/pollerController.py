import logging
import time

from commands import motionSensor
from commands import oneWireSensor
from multiprocessing import Process


CHECK_RATE = 5


def startPollers(config):
    runningSensors = []
    while True:
        logging.info('Checking sensors')
        for i in range(len(config)):
            if config[i]['poller'] == 'MotionPoller':
                p = Process(target=handleMotionSensor, args=(config[i], ))
                p.start()
                runningSensors.append(p)
                pass
            if config[i]['poller'] == 'OneWire':
                p = Process(target=handleWireSensor, args=(config[i], ))
                p.start()
                runningSensors.append(p)
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
