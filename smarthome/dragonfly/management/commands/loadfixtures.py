from django.core.management.base import BaseCommand, CommandError
import requests
import json


class Command(BaseCommand):
    help = 'Load a days worth of data.'

    def handle(self, *args, **options):
        data = {
            'id': 1,
            'name': 'testPoster',
            'coefficents': "beer",
            'units': 'oz'
        }
        sensorUrl = "http://0.0.0.0:8000/dragonfly/sensors/"
        requests.post(sensorUrl, json.dumps(data))

