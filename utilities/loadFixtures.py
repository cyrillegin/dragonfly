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
    for i in range(12 * 60 * 24):
        newPoint = {
            'sensor': {
                'uuid': id,
                'station': 'place'
            },
            'reading': {
                'timestamp': (time.time() * 1000) - (i * 1000 * 5),
                'value': 400 * math.sin(0.1 * i),
            }
        }
        resp = requests.post('http://localhost:5000/api/sensor', data=json.dumps(newPoint))
        print("{}% {}".format((i / 12 * 60 * 24), resp))
