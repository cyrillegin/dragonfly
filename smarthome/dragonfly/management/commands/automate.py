from django.core.management.base import BaseCommand
from datetime import datetime
import json
import time

from dragonfly import models


class Command(BaseCommand):
    help = 'Load a days worth of data.'

    def handle(self, *args, **options):
        TurnOnTime = 8
        TurnOffTime = 20
        IsOn = True
        # 60 seconds * 30 minutes = check every half hour
        CheckRate = 60 * 30
        print "Starting automation control"
        while(True):
            currentHour = datetime.now().hour
            if IsOn is True and TurnOffTime is currentHour:
                print "Turning off lights, the current time is {}".format(datetime.now())
                with open('commandQueue.json', 'w') as outfile:
                    json.dump({'value': 0}, outfile)
                IsOn = False
            if IsOn is False and TurnOnTime is currentHour:
                print "Turing on lights, the current time is {}".format(datetime.now())
                with open('commandQueue.json', 'w') as outfile:
                    json.dump({'value': 1}, outfile)
                IsOn = True
            time.sleep(CheckRate / 2)
            currentHour = datetime.now().hour
            if currentHour > TurnOnTime and currentHour < TurnOffTime:
                # light is on
                switch = models.Sensor.objects.get(name="lightSwitch")
                if switch.toDict().value is False:
                    print "Turing on lights, the current time is {}".format(datetime.now())
                    with open('commandQueue.json', 'w') as outfile:
                        json.dump({'value': 1}, outfile)

            else:
                # light is off
                switch = models.Sensor.objects.get(name="lightSwitch")
                if switch.toDict().value is True:
                    print "Turning off lights, the current time is {}".format(datetime.now())
                    with open('commandQueue.json', 'w') as outfile:
                        json.dump({'value': 0}, outfile)
            time.sleep(CheckRate / 2)
