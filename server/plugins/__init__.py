import os
import logging
import time
from multiprocessing import Process
import importlib
import requests
import json

from sessionManager import sessionScope
from models import Sensor

PLUGINS = []
runningSensors = []

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


for filename in os.listdir(os.path.abspath(os.path.dirname(__file__))):
    if filename.endswith('.py') and not filename.startswith('__'):
        PLUGINS.append(filename.replace('.py', ''))


def query(sensor):
    logging.info('Starting polling for {}'.format(sensor['name']))
    if sensor['status'] == 'disabled':
        return
    try:
        module = importlib.import_module('plugins.{}'.format(sensor['poller']))
    except Exception as e:
        logging.error('Error importing plugin. Quiting')
        logging.error(e)
        return

    if 'pollRate' in sensor and sensor['pollRate'] is not None and sensor['pollRate'] != '':
        timeout = int(sensor['pollRate'])
    else:
        timeout = 60
    if 'endpoint' in sensor and sensor['endpoint'] is not None and sensor['endpoint'] != '':
        while True:
            payload = module.GetValues(sensor)
            if sensor['status'] == 'error' and payload['sensor']['status'] != 'error':
                sensor['sensor']['status'] = 'online'
            resp = requests.post('http://{}/api/sensor'.format(sensor['endpoint']), data=json.dumps(payload))
            logging.info(resp)
            time.sleep(timeout)
    else:
        logging.info('Sensor needs endpoint')


def checkForSensors():
    while True:
        logging.info('Checking for new sensors and restarting child processes.')
        with sessionScope() as session:
            sensors = session.query(Sensor)
            index = 0
            for i in sensors:
                if len(runningSensors) < index + 1:
                    runningSensors.append(None)
                if runningSensors[index] is not None and runningSensors[index].is_alive():
                    runningSensors[index].terminate()
                p = Process(target=query, args=(i.toDict(), ))
                p.start()
                runningSensors[index] = p
                index += 1
        time.sleep(60 * 10)


p = Process(target=checkForSensors)
p.start()
