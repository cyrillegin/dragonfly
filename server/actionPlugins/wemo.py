import logging
import subprocess


logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


def TakeAction(action, value, sensor):
    logging.debug("taking action")
    subprocess.call(["wemo", "switch", action['meta'], 'on'])


def ResolveAction(sensor, action):
    logging.debug("resolving")
    subprocess.call(["wemo", "switch", action['meta'], 'off'])
