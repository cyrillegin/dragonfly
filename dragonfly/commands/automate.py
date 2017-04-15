from datetime import datetime
import json
import time
import requests

URL = 'http://localhost:8000/api/command'
TurnOnTime = 9
TurnOffTime = 8


def automate():
    IsOn = True
    # 60 seconds * 30 minutes = check every half hour
    CheckRate = 60 * 30
    print "Starting automation control"
    while(True):
        currentHour = datetime.now().hour
        if IsOn is True and TurnOffTime is currentHour:
            response = requests.post(URL, json.dumps({'lightswitch': 'lightswitch', 'value': False}))
            print "Turned off lights at {}, got response: {}".format(datetime.now(), response)
            IsOn = False
        if IsOn is False and TurnOnTime is currentHour:
            response = requests.post(URL, json.dumps({'lightswitch': 'lightswitch', 'value': True}))
            print "Turned on lights at {}, got response: {}".format(datetime.now(), response)
            IsOn = True
        time.sleep(CheckRate / 2)
