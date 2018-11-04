from api.sensor import Sensors
from api.reading import Readings
from api.plugin import Plugins
from api.action import Actions


class ResourceApi:
    sensor = Sensors()
    reading = Readings()
    plugin = Plugins()
    action = Actions()
