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
SENSORS = [{
    'OneWire': [{
        'ID': 'id',
        'SensorName': 'test sensor',
        'PollRate': 60
    }]
}]
