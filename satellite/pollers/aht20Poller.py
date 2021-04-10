import time
try:
    import board
    import adafruit_ahtx0

    sensor = adafruit_ahtx0.AHTx0(board.I2C())
except:
    print('could not import board or adafruit_ahtx0, aht sensor will not be available.')

# Create the sensor object using I2C


def GetValues(sensorDetails):
    if sensorDetails == "humidity":
        value = sensor.relative_humidity
        print('aht20Poller: Humidity is currently: {}'.format(value))
    if sensorDetails == "temperature":
        value = sensor.temperature * 9 / 5 + 32
        print('aht20Poller: Temperature is currently: {}'.format(value))
    newReading = {
        'timestamp': time.time() * 1000,
         'value': value,
    }
    return newReading
