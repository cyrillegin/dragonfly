import os

print 'hello'

PLUGINS = []

for filename in os.listdir(os.path.abspath(os.path.dirname(__file__))):
    if filename.endswith('.py') and not filename.startswith('__'):
        PLUGINS.append(filename.replace('.py', ''))
print 'plugins found:'
print PLUGINS
