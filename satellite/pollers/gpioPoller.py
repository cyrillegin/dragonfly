import time
import os
def readTemperature(deviceLocation):
    f = open(deviceLocation, 'r')
    lines = f.readlines()
    f.close()
    return lines


def GetValues(sensor):
    device = os.getenv('SENSOR_{}_META'.format(sensor))
    if device == 'fake':
        return {
            'timestamp': time.time() * 1000,
            'value': 1.0
        }
    deviceLocation = "/sys/bus/w1/devices/{}/w1_slave".format(device)

    lines = readTemperature(deviceLocation)
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = readTemperature(deviceLocation)

    temp_output = lines[1].find('t=')

    if temp_output != -1:
        temp_string = lines[1].strip()[temp_output + 2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = temp_c * 9.0 / 5.0 + 32.0

        print('Temperature is currently: {}'.format(temp_f))
        newReading = {
            'timestamp': time.time() * 1000,
            'value': temp_f,
        }
        return newReading
