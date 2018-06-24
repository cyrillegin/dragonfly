import os
import logging
import time
from multiprocessing import Process
import importlib
import requests
import json

from sessionManager import sessionScope
from models import Action, Reading, Sensor

PLUGINS = []
runningActions = []


logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)

for filename in os.listdir(os.path.abspath(os.path.dirname(__file__))):
    if filename.endswith('.py') and not filename.startswith('__'):
        PLUGINS.append(filename.replace('.py', ''))


def query(action, session):
    logging.info('Starting actions for {}'.format(action['plugin']))
    if action['status'] == 'disabled':
        return
    try:
        module = importlib.import_module('actionPlugins.{}'.format(action['plugin']))
    except Exception as e:
        logging.error('Error importing plugin. Quiting')
        logging.error(e)
        return

    if 'notificationRate' in action and action['notificationRate'] is not None and action['notificationRate'] != '':
        notificationRate = int(action['notificationRate'])
    else:
        notificationRate = 60

    timeout = notificationRate

    while True:
        lastReading = session.query(Reading).filter_by(sensor=action['sensor']).order_by('timestamp desc').first()
        lastValue = float(lastReading.toDict()['value'])
        checkValue = float(action['value'])
        if lastReading is not None:
            if action['operator'] == '>' and lastValue > checkValue:
                logging.info('Reading out of bounds.')
                notify(action, session, lastValue, module)
            elif action['operator'] == '<' and lastValue < checkValue:
                logging.info('Reading out of bounds.')
                notify(action, session, lastValue, module)
            else:
                # Update sensor alarm
                updateSensorAlaram(session, action['sensor'], False)
        else:
            logging.info('No readings currently exist.')
            
        time.sleep(timeout)


def notify(action, session, lastValue, module):
    updatedAction = session.query(Action).filter_by(uuid=action['uuid']).one()

    if updatedAction.toDict()['lastNotification'] is None or time.time() * 1000 - int(updatedAction.toDict()['notificationRate']) * 1000 > int(updatedAction.toDict()['lastNotification']):
        sensor = session.query(Sensor).filter_by(uuid=action['sensor']).one()

        logging.info('Taking action.')
        module.TakeAction(updatedAction.toDict(), lastValue, sensor.toDict())
        # Update action time
        setattr(updatedAction, 'lastNotification', time.time() * 1000)
        session.add(updatedAction)
        # Update sensor alarm
        updateSensorAlaram(session, action['sensor'], True)
        session.commit()


def updateSensorAlaram(session, sensorId, alarm):
    sensor = session.query(Sensor).filter_by(uuid=sensorId).one()
    if sensor.toDict()['alarm'] is not alarm:
        print('updating sensor alarm')
        setattr(sensor, 'alarm', alarm)
        session.commit()


def checkForActions():
    while True:
        logging.info('Checking for new actions and restarting child processes.')
        with sessionScope() as session:
            actions = session.query(Action)
            index = 0
            for i in actions:
                if len(runningActions) < index + 1:
                    runningActions.append(None)
                print('action found!')
                print(i.toDict())
                if runningActions[index] is not None and runningActions[index].is_alive():
                    runningActions[index].terminate()
                p = Process(target=query, args=(i.toDict(), session, ))
                p.start()
                runningActions[index] = p
                index += 1
        time.sleep(60 * 10)


p = Process(target=checkForActions)
p.start()
