import requests
import json
import logging

from config import SLACK_URL
from config import ENVIRONMENT

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


def TakeAction(action, value, sensor):
    print(sensor)
    body = {
        "text": "Dragonfly Alarm",
        "attachments": [
            {
                "title": sensor['name'],
                "text": "Sensor is {} {} and is out of bounds, value is currently {}".format(action['operator'], action['value'], value)
            }
        ]
    }
    if ENVIRONMENT is 'development':
        body['text'] += ' Test'
    body['text'] = "*{}*".format(body['text'])
    logging.info('Sending message to Slack')
    resp = requests.post(SLACK_URL, data=json.dumps(body))
    logging.info(resp)
