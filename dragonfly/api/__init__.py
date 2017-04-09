
from reading import Readings
from sensor import Sensors
from log import Logs
from command import Command


class ResourceApi:

    sensor = Sensors()
    reading = Readings()
    log = Logs()
    command = Command()
