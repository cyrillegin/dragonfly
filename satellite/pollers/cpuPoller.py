import psutil
import time
try:
    from gpiozero import CPUTemperature
except:
    print('could not import gpiozero, cpu temperature sensor will not be available.')

def GetValues(readingType):
    print(readingType)

    # disk space available
    result = 'fail'
    if readingType == 'disk_usage':
        freeSpace = psutil.disk_usage('/').free
        print('cpu: Current free disk space: {}'.format(freeSpace))
        result = {
            'timestamp': time.time() * 1000,
            'value': freeSpace
        }


    # cpu usage
    if readingType == 'cpu_usage':
        values = []

        for i in range(5):
            values.extend(psutil.cpu_percent(interval=1, percpu=True))
            time.sleep(0.1)
        sum = 0
        print(values)
        for i in values:
            sum += i
        print(sum)
        sum /= len(values)
        print('cpu: percent use: {}'.format(sum))
        result = {
            'timestamp': time.time() * 1000,
            'value': sum
        }
    # network ins and outs - TODO

    # temperatures
    if readingType == 'temperature':
        result = {
            'timestamp': time.time() * 1000,
            'value': CPUTemperature().temperature
        }

    # ram usage
    if readingType == 'ram_usage':
        freeSpace = psutil.virtual_memory().free
        print('cpu: Current free ram space: {}'.format(freeSpace))
        result = {
            'timestamp': time.time() * 1000,
            'value': freeSpace
        }

    return result
