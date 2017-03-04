from django.core.management.base import BaseCommand
from datetime import datetime
import json
import time


class Command(BaseCommand):
    help = 'Load a days worth of data.'

    def handle(self, *args, **options):
        TurnOnTime = 6
        TurnOffTime = 20
        IsOn = True
        # 60 seconds * 30 minutes = check every half hour
        CheckRate = 60 * 30
        print "Starting automation control"
        while(True):
            currentHour = datetime.now().hour
            if IsOn is True and TurnOffTime is currentHour:
                print "Turning off lights"
                with open('commandQueue.json', 'w') as outfile:
                    json.dump({'value': 0}, outfile)
                IsOn = False
            if IsOn is False and TurnOnTime is currentHour:
                print "Turing on lights"
                with open('commandQueue.json', 'w') as outfile:
                    json.dump({'value': 1}, outfile)
                IsOn = True
            time.sleep(CheckRate)
