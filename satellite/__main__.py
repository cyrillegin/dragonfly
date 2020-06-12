#!/usr/bin/env python
import cherrypy
from cherrypy.lib.static import serve_file

class Root(object):

    @cherrypy.expose
    def health(self, *args, **kwargs):
        print('Got health check')
        return 'healthy'

    @cherrypy.expose
    def default(self, *args, **kwargs):
        return 'hello satellite'


def RunServer():
    cherrypy.tree.mount(Root(), '/')
    cherrypy.server.socket_host = "0.0.0.0"
    cherrypy.server.socket_port = 3001
    cherrypy.engine.start()
    cherrypy.engine.block()


if __name__ == "__main__":
    print("starting server!")
    RunServer()
