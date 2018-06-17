import json
import requests
import logging
import time
import uuid
import base64
import math

logging.basicConfig(
    format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)

baseUrl = "http://localhost:5000/api"


def generateUuid():
    u = getattr(uuid, 'uuid1')()
    return base64.b64encode(u.bytes, "-_")[:-2]


if __name__ == "__main__":
    logging.info("Loading Fixtures.")
    id = generateUuid()
    for i in range(60 * 24):
        newPoint = {
            'sensor': {
                'uuid': id,
                'station': 'place',
                'poller': 'test',
                'pin': 'test'
            },
            'reading': {
                'timestamp': (time.time() * 1000) - (i * 1000 * 60),
                'value': 400 * math.sin(0.01 * i),
            }
        }
        resp = requests.post('http://localhost:5000/api/sensor', data=json.dumps(newPoint))
        print("{}% {}".format((i / 60.0 * 24.0 / 10), resp))
