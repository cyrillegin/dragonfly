
import cherrypy
import json
import logging
import delorean
import dateutil.parser

import reading
from sensor import Sensors


class Query():
    exposed = True

    def GET(self, *args, **kwargs):
        return "query"

    def POST(self, *args, **kwargs):
        cherrypy.response.headers['Content-Type'] = 'application/json'
        try:
            queryData = json.load(cherrypy.request.body)
            logging.debug("Got data:")
        except (ValueError, TypeError):
            logging.error("Request data is not JSON: %s", cherrypy.request.body)
            statusCode = "400"
            cherrypy.response.status = statusCode
            return json.dumps({}, indent=4)

        response = []
        for i in queryData['targets']:

            sensor = i['target']
            start = int(delorean.Delorean(dateutil.parser.parse(queryData['range']['from'])).epoch)
            end = int(delorean.Delorean(dateutil.parser.parse(queryData['range']['to'])).epoch)

            readings = reading.getReadings(sensor, start, end)

            newObj = {
                "target": i['target'],
                "datapoints": []
            }
            for j in readings['readings']:
                newObj['datapoints'].append([j['value'], int(j['created'] * 1000)])
            response.append(newObj)
        print response

        return json.dumps(response)


class Search():
    exposed = True

    def GET(self, *args, **kwargs):
        return "search"

    def POST(self, *args, **kwargs):
        cherrypy.response.headers['Content-Type'] = 'application/json'

        response = []
        sensor = Sensors()
        sensors = json.loads(sensor.GET())
        for i in sensors['sensor_list']:
            response.append({"text": i['name'], "value": i['name']})
        return json.dumps(response)


class GrafanaApi:
    exposed = True

    query = Query()
    search = Search()

    def GET(self, *args, **kwargs):
        return "pass"
