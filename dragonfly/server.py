import os
import sys
import cherrypy

from tool import SQLAlchemyTool
from plugin import SQLAlchemyPlugin
import base

# from sqlalchemy.ext.declarative import declarative_base
from cherrypy.lib.static import serve_file
from api import ResourceApi


PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(PATH)
STATIC = os.path.join(PATH, 'static')


class Root(object):
    api = ResourceApi()

    @property
    def db(self):
        return cherrypy.request.db

    @cherrypy.expose
    def index(self):
        return serve_file("{}/index.html".format(STATIC))


def get_cp_config():
    return {
        '/': {
            'tools.db.on': True,
            'tools.staticdir.on': True,
            'tools.staticdir.dir': STATIC,
            'tools.staticdir.index': 'index.html',
        },
        '/api': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher()
        }
    }


def runserver(config):
    cherrypy.tools.db = SQLAlchemyTool()

    cherrypy.tree.mount(Root(), '/', config)

    dbfile = os.path.join(PATH, 'aquaponic.db')
    if not os.path.exists(dbfile):
        open(dbfile, 'w+').close()

    sqlalchemy_plugin = SQLAlchemyPlugin(
        cherrypy.engine, base.Base, 'sqlite:///%s' % (dbfile),
        echo=True
    )
    sqlalchemy_plugin.subscribe()
    sqlalchemy_plugin.create()

    cherrypy.server.socket_host = "0.0.0.0"
    cherrypy.engine.start()
    cherrypy.engine.block()


if __name__ == "__main__":
    runserver(get_cp_config())
else:
    cherrypy.config.update({'environment': 'embedded'})
    application = cherrypy.Application(
        Root(), script_name=None, config=get_cp_config())





