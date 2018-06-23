import requests
import time
import logging

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)

URL = 'https://api.coinmarketcap.com/v1/ticker/'


def GetValues(params):
    # Note, this usess to pin to figure out which endpoint to get.
    newReading = None
    try:
        response = requests.get(URL).json()
        for i in response:
            if i['id'] == params['meta']:
                newReading = {
                    'sensor': {
                        'uuid': params['uuid'],
                        'poller': 'cryptoPoller'
                    },
                    'reading': {
                        'timestamp': time.time() * 1000,
                        'value': i['price_usd']
                    }
                }
                logging.info('Got reading: {}'.format(newReading))
    except Exception as e:
        logging.error('Error pulling data.')
        logging.error(e)
        return {'error': e}

    if newReading is None:
        logging.error('Couldnt find sensor in api')
        return {'error': 'Couldnt find sensor in api'}

    return newReading


if __name__ == "__main__":
    GetValues({'meta': 'bitcoin', 'uuid': 'test'})
