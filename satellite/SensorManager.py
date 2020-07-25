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
#     ip - ip address
# }
def query(sensor):
    if sensor['type'] != 'temperature':
        return
    while True:
        if sensor['type'] == 'temperature':
            values = gpioPoller.GetValues(os.getenv('SENSOR_A_META'))
            payload = {
                'value': values['value'],
                'timestamp': values['timestamp'],
                'sensorId': sensor['sensorId'],
                'stationId': sensor['stationId']
            }
            resp = requests.post('http://{}/api/reading'.format(sensor['ip']), json=payload)
            time.sleep(sensor['pollRate'])


class SensorManager:
    class __SensorManager:
        def __init__(self):
            self.sensorsBeingPolled = {}

        def startSensor(self, sensor):
            p = Process(target=query, args=(sensor, ))
            p.start()
            self.sensorsBeingPolled[sensor['sensorId']] = p

        def stopSensor(self):
            print('stopping sensor')

        def checkSensor(self, sensor):
            if kwargs['sensorId'] in self.sensorsBeingPolled and self.sensorsBeingPolled[kwargs['sensorId']].is_alive():
                return 'healthy'
            self.startSensor(sensor)
            return ' unhealthy'

        def testSensor(self, sensor):
            poller = os.getenv('SENSOR_{}_POLLER'.format(sensor))
            module = importlib.import_module('pollers.{}'.format(poller))
            result = module.GetValues(sensor)
            print(result)
            return result

    instance = None

    def __init__(self):
        if not SensorManager.instance:
            SensorManager.instance = SensorManager.__SensorManager()

    def __getattr__(self, name):
        return getattr(self.instance, name)


SensorMap = {

}
