#!/usr/bin/env python
import cherrypy
import os
import sys
import logging
import socket
import json
from api import ResourceApi
from cherrypy.lib.static import serve_file

import sensorPlugins  # noqa: F401
import actionPlugins  # noqa: F401

PATH = os.path.abspath(os.path.dirname(__file__))
STATIC = os.path.join(PATH, '../dist')
sys.path.append(PATH)

# NOTE: Do not update this manually, use `npm run incMajor` or `npm  run incMinor`
VERSION = '0.9.0'
BUILD_DATE = 1527451286.86


def get_cp_config():
    config = {
        '/': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': STATIC,
            'tools.staticdir.index': 'index.html',
            'tools.sessions.on': True
        },
        '/api': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher()
        },
    }
    return config


class Root(object):
    api = ResourceApi()

    @cherrypy.expose
    def getIP(self):
        ip = socket.gethostbyname(socket.gethostname())
        return json.dumps({'localIP': ip})

    @cherrypy.expose
    def default(self, *args, **kwargs):
        return serve_file(os.path.join(STATIC, 'index.html'))


def RunServer():
    cherrypy.tree.mount(Root(), '/', config=get_cp_config())
    cherrypy.server.socket_host = "0.0.0.0"
    cherrypy.server.socket_port = int(os.environ.get('PORT', 5000))
    cherrypy.engine.start()
    cherrypy.engine.block()


if __name__ == "__main__":
    logging.info("starting server!")
    RunServer()
