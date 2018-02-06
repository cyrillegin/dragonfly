import requests
import time
import json
import logging
import config

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)

URL = 'https://api.coinmarketcap.com/v1/ticker/'
READINGURL = 'http://{}:{}/api/reading'.format(config.MCPIP, config.MCPPORT)


def GetValues(params):
    while True:
        try:
            response = requests.get(URL).json()
            for i in response:
                if i['id'] == params['id']:
                    newReading = {
                        'sensor': {
                            'name': 'crypto-' + params['id']
                        },
                        'readings': [{
                            'timestamp': time.time(),
                            'value': i['price_usd']
                        }]
                    }
                    
        except Exception as e:
            logging.error('Error pulling data.')
            logging.error(e)
            time.sleep(params['pollRate'])
        if params['report']:
            try:
                logging.info('Saving: {}'.format(newReading))
                response = requests.post(READINGURL, json.dumps(newReading))
                logging.info('Response: '.format(response))
            except Exception as e:
                logging.error('Error posting data.')
                logging.error(e)
        time.sleep(params['pollRate'])
