"""
__init__.py

Authors: Victor Szczepanski
"""
import cherrypy
import json

# Local Imports
from sensor import Sensors


class SysData:
    exposed = True

    # @require()
    def GET(self, sensor_id=None):
        cherrypy.response.headers['Content-Type'] = 'application/json'
        data = {'version': "__version__"}
        return json.dumps(data, indent=4)


class ResourceApi:

    sysdata = SysData()
    sensors = Sensors()
