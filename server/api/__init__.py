from api.sensor import Sensors
from api.reading import Readings
from api.plugin import Plugins


class ResourceApi:
    sensor = Sensors()
    reading = Readings()
    plugin = Plugins()
