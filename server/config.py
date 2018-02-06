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
    'poller': 'Crypto',
    'pollRate': 60,
    'sensorName': 'Ethereum',
    'id': 'ethereum',
    'report': True,
    'controls': []
}, {
    'poller': 'Crypto',
    'pollRate': 60,
    'sensorName': 'Ripple',
    'id': 'ripple',
    'report': True,
    'controls': []
}]
