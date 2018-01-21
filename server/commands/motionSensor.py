#!/usr/bin/python
import time
import requests
import logging
try:
    import RPi.GPIO as GPIO
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)
except Exception as e:
    logging.debug('Could not import gpio')

from commands.controller import sendEvent


def ReadMotion(params):
    GPIO.setup(params['pin'], GPIO.IN)
    while True:
        motionDetected = GPIO.input(params['pin'])
        if motionDetected != 0:
            logging.info('Motion detected: {}'.format(motionDetected))

        if params['report']:
            payload = {
                'sensor': {
                    'name': params['sensorName']
                },
                'readings': [{
                    'timestamp': time.time(),
                    'value': motionDetected
                }]
            }
            try:
                logging.debug('Sending motion to server.')
                response = requests.post(READINGURL, json.dumps(payload))
                logging.debug('Response was:')
                logging.debug(response)
            except Exception as e:
                logging.error('Error sending request.')
                logging.error(e)
        for command in params['controls']:
            for event in command['events']:
                if event['operator'] == 'greaterThan':
                    if motionDetected > event['condition']:
                        sendEvent(command['controller'], event['command'])
        if params['pollRate'] == 0:
            break
        time.sleep(params['pollRate'])
