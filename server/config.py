"""
config.py

Holds config information for each system.
"""
DBFILE = "/dragonDB.db"
isMCP = False
# Use 'localhost' for base station.
MCPIP = "192.168.0.10"
MCPPORT = '5000'
STATIONNAME = 'computer'
CHECK_RATE = 60
SENSORS = [{
    'poller': 'MotionPoller',
    'pin': 14,
    'pollRate': 10,
    'sensorName': 'test sensor',
    'report': False,
    'controls': [{
        'controller': 'lightStrip',
        'events': [{
            'when': 'motion',
            'operator': 'greaterThan',
            'condition': 0,
            'command': 'turnOn'
        }]
    }]
}, {
    'poller': 'OneWire',
    'deviceId': 'id',
    'sensorName': 'test sensor',
    'pollRate': 30,
    'report': False,
    'controls': [{
        'controller': 'fermentationFridge',
        'events': [{
            'when': 'value',
            'operator': 'greaterThan',
            'condition': 40,
            'command': 'turnOn'
        }, {
            'when': 'value',
            'operator': 'lessThan',
            'condition': 30,
            'command': 'turnOff'
        }]
    }]
}]
