from multiprocessing import Process
import os
import time
import requests
import json
import importlib
from pollers import gpioPoller


# {
#     sensorId - number
#     stationId - number
#     pollRate - number
#     ip - adress to send readings to
#     type - enum (so far just temperature
# }
def query(sensor):
    if sensor['type'] != 'temperature':
        return
    while True:
        if sensor['type'] == 'temperature':
            print(sensor)
            values = gpioPoller.GetValues(sensor['meta'])
            payload = {
                'value': values['value'],
                'timestamp': values['timestamp'],
                'sensorId': sensor['sensorId'],
                'stationId': sensor['stationId']
            }
            print('Sending value {} from {}'.format(values['value'], sensor['stationId']))
            resp = requests.post('http://{}/api/reading'.format(sensor['ip']), json=payload)
            time.sleep(int(sensor['pollRate']))


class SensorManager:
    class __SensorManager:
        def __init__(self):
            self.sensorsBeingPolled = {}

        def startSensor(self, sensor):
            i = 0
            print(sensor)
            sensorMeta = -1
            while True:
                envSensor = os.getenv('SENSOR_{}_HARDWARE_NAME'.format(i))
                if envSensor is None:
                    break
                if envSensor == sensor['hardwareName']:
                    sensorMeta = i
                    break
                i = i + 1
            if sensorMeta == -1:
                return
            sensor['meta'] = sensorMeta
            p = Process(target=query, args=(sensor, ))
            p.start()
            self.sensorsBeingPolled[sensor['sensorId']] = p

        def stopSensor(self):
            print('stopping sensor')

        def checkSensor(self, sensor):
            if sensor['sensorId'] in self.sensorsBeingPolled and self.sensorsBeingPolled[sensor['sensorId']].is_alive():
                print('sensor already exists and is healthy')
                return 'healthy'
            self.startSensor(sensor)
            print('sensor is unhealthy')
            return ' unhealthy'

        def testSensor(self, sensor):
            poller = os.getenv('SENSOR_{}_POLLER'.format(sensor))
            module = importlib.import_module('pollers.{}'.format(poller))
            result = module.GetValues(sensor)
            return result

    instance = None

    def __init__(self):
        if not SensorManager.instance:
            SensorManager.instance = SensorManager.__SensorManager()

    def __getattr__(self, name):
        return getattr(self.instance, name)


SensorMap = {

}
