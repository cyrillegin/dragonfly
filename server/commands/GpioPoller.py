
import dht11
try:
    import RPi.GPIO as GPIO
except Exception, e:
    print e
import json
import requests
import logging
import time

READINGURL = "http://192.168.0.3:5000/api/reading"
POLL_RATE = 60*5

Temp_sensor = 14

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


def GpioPoller():

    GPIO.setmode(GPIO.BCM)       # Use BCM GPIO numbers

    instance = dht11.DHT11(pin=Temp_sensor)
    Alive = True
    while Alive:
        try:
            result = instance.read()
        except Exception, e:
            logging.error('Error reading from instance')
            logging.debug(e)
        if result.is_valid():
                logging.info("Got new readings")
                temp = result.temperature
                logging.info('Temp in C: {}'.format(temp))
                temp = (temp * 1.8) + 32
                humd = result.humidity
                logging.info("Temperature: {} Humidity: {}".format(temp, humd))
                newTempReading = {
                    'sensor': {
                        'name': 'outdoorTemperature'
                    },
                    'readings': [{
                        'timestamp': time.time(),
                        'value': temp
                    }]
                }
                newHumdReading = {
                    'sensor': {
                        'name': 'outdoorHumidity'
                    },
                    'readings': [{
                        'timestamp': time.time(),
                        'value': humd
                    }]
                }

                logging.info('Sending Data')
                try:
                    response = requests.post(READINGURL, json.dumps(newTempReading))
                    logging.info(response)
                    response = requests.post(READINGURL, json.dumps(newHumdReading))
                    logging.info(response)
                except Exception, e:
                    print "error talking to server:"
                    print e
        else:
                logging.error("result didn't return a valid")
                logging.debug(result)
        time.sleep(POLL_RATE)
