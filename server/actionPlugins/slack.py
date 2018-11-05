import requests
import json
import logging

from config import SLACK_URL
from config import ENVIRONMENT

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


def TakeAction(action, value, sensor):
    body = {
        "text": "Dragonfly Alarm",
        "attachments": [
            {
                "title": sensor['name'],
                "text": "Sensor is {} {} and is out of bounds, value is currently {}".format(action['operator'], action['value'], value),
                "color": "#FF0000"
            }
        ]
    }

    if ENVIRONMENT is 'development':
        body['text'] += ' Test'
    if action['meta'] is not None and action['meta'] != '':
        body['attachments'][0]['text'] += "\n{}".format(action['meta'])
    body['text'] = "*{}*".format(body['text'])

    logging.debug('Sending message to Slack')
    resp = requests.post(SLACK_URL, data=json.dumps(body))
    logging.debug(resp)


def ResolveAction(sensor):
    body = {
        "text": "Dragonfly Alarm Resolved",
        "attachments": [
            {
                "title": sensor['name'],
                "text": "Sensor alarm has been resolved.",
                "color": "#00FF00"
            }
        ]
    }
    if ENVIRONMENT is 'development':
        body['text'] += ' Test'
    body['text'] = "*{}*".format(body['text'])
    logging.debug('Sending message to Slack')
    resp = requests.post(SLACK_URL, data=json.dumps(body))
    logging.debug(resp)
