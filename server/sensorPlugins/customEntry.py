import time
import logging

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


def GetValues(params):
    print(params)
    newReading = {
        'sensor': {
            'uuid': params['uuid'],
            'poller': 'customEntry'
        },
        'reading': {
            'timestamp': time.time() * 1000,
            'value': params['meta'],
        }
    }
    return newReading


if __name__ == '__main__':
    GetValues()
