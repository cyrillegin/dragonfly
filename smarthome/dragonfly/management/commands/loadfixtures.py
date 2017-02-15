from django.core.management.base import BaseCommand, CommandError
import requests
import json


class Command(BaseCommand):
    help = 'Load a days worth of data.'

    def handle(self, *args, **options):
        # Create two sensors
        data = {
            'name': 'testSensor1',
            'coefficents': "(2,63",
            'units': 'oz'
        }
        sensorUrl = "http://0.0.0.0:8000/dragonfly/api/sensors/"
        requests.post(sensorUrl, json.dumps(data, indent=2))

        data = {
            'name': 'testSensor2',
            'coefficents': "9/5, 32",
            'units': 'degrees'
        }
        sensorUrl = "http://0.0.0.0:8000/dragonfly/api/sensors/"
        requests.post(sensorUrl, json.dumps(data, indent=2))
