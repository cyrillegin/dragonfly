import logging
from commands import motionSensor
from commands import oneWireSensor


def startPollers(config):
    for sensor in config:
        logging.info('Starting {}'.format(sensor['poller']))
        if sensor['poller'] == 'MotionPoller':
            motionSensor.ReadMotion(sensor)
            pass
        if sensor['poller'] == 'OneWire':
            oneWireSensor.ReadOneWire(sensor)
