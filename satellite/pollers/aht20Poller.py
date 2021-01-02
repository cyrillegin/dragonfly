import time
import board
import adafruit_ahtx0

# Create the sensor object using I2C
sensor = adafruit_ahtx0.AHTx0(board.I2C())

def GetValues(sensor):
    humidity = sensor.relative_humidity
    print('aht20Poller: Humidity is currently: {}'.format(humidity))
    newReading = {
        'timestamp': time.time() * 1000,
         'value': humidity,
    }
    return newReading
