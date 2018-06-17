import time
import logging

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


def readTemperature(deviceLocation):
    f = open(deviceLocation, 'r')
    lines = f.readlines()
    f.close()
    return lines


def GetValues(params):
    deviceLocation = "/sys/bus/w1/devices/{}/w1_slave".format(params['meta'])

    while True:
        lines = readTemperature(deviceLocation)
        while lines[0].strip()[-3:] != 'YES':
            time.sleep(0.2)
            lines = readTemperature(deviceLocation)

        temp_output = lines[1].find('t=')

        if temp_output != -1:
            temp_string = lines[1].strip()[temp_output+2:]
            temp_c = float(temp_string) / 1000.0
            temp_f = temp_c * 9.0 / 5.0 + 32.0

            logging.info('Temperature is currently: {}'.format(temp_f))
            newReading = {
                'sensor': {
                    'uuid': params['uuid'],
                    'poller': 'gpioPoller'
                },
                'readings': [{
                    'timestamp': time.time(),
                    'value': temp_f,
                }]
            }
            return newReading


if __name__ == '__main__':
    GetValues({'pin': '4', 'meta': '28-0516a43668ff', 'uuid': 'test'})
