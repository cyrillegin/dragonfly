from multiprocessing import Process
from pollers import gpioPoller
import time
import requests
import json

def query(sensor):
    print(sensor)
    if sensor['type'] != 'temperature':
        return
    while True:
        if sensor['type'] == 'temperature':
            values = gpioPoller.GetValues({'uuid':'asdf', 'meta': '28-0516a49158ff'})
            payload = {
                'value': values['reading']['value'],
                'timestamp': values['reading']['timestamp'],
                'sensorId': sensor['sensorId'],
                'stationId': sensor['stationId']
            }
            resp = requests.post('http://192.168.1.176:3000/api/reading', json=payload)
            time.sleep(5)


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

        def checkSensor(self, kwargs):
            if kwargs['sensorId'] in self.sensorsBeingPolled and self.sensorsBeingPolled[kwargs['sensorId']].is_alive():
                return 'healthy'
            self.startSensor(kwargs)
            return ' unhealthy'
        
        def testSensor(self):
            result = gpioPoller.GetValues({'uuid': 'asdf','meta': '28-0516a49158ff'})
            return 'healthy'
    instance = None

    def __init__(self):
        if not SensorManager.instance:
            SensorManager.instance = SensorManager.__SensorManager()

    def __getattr__(self, name):
        return getattr(self.instance, name)
