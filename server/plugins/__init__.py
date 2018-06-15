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
    try:
        module = importlib.import_module('plugins.{}'.format(sensor['poller']))
    except Exception as e:
        logging.error('Error importing plugin. Quiting')
        logging.error(e)
        return
    if 'pollRate' in sensor:
        timeout = int(sensor['pollRate'])
    else:
        timeout = 60
    while True:
        payload = module.GetValues(sensor)
        resp = requests.post('http://{}/api/sensor'.format(sensor['endpoint']), data=json.dumps(payload))
        logging.info(resp)
        time.sleep(timeout)


def checkForSensors():
    while True:
        logging.info('Checking for sensor')
        with sessionScope() as session:
            sensors = session.query(Sensor)
            index = 0
            print '\nloading sensors'
            for i in sensors:
                if i.toDict()['poller'] is None:
                    continue
                if len(runningSensors) < index + 1:
                    runningSensors.append(None)
                if runningSensors[index] is not None and runningSensors[index].is_alive():
                    continue
                p = Process(target=query, args=(i.toDict(), ))
                p.start()
                runningSensors[index] = p
                index += 1
        time.sleep(60 * 5)


p = Process(target=checkForSensors)
p.start()
