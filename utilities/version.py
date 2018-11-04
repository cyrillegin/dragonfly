import logging
import json
import sys
import os
import time

VERSION = '0.9.2'
BUILD_DATE = 1541367533.035486

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


def patchVersion(*args):
    logging.info("Current version: {}".format(VERSION))
    version = VERSION.split('.')
    version[2] = str(int(version[2]) + 1)
    version = ".".join(version)
    saveVersion(version)


def minorVersion(*args):
    logging.info("Current version: {}".format(VERSION))
    version = VERSION.split('.')
    version[1] = str(int(version[1]) + 1)
    version[2] = "0"
    version = ".".join(version)
    saveVersion(version)


def saveVersion(version):
    logging.info("Saving new version: {}".format(version))
    newTime = time.time()
    logging.info("New version is: {}".format(version))
    newFile = ""
    # Update this file
    with open('utilities/version.py', 'r') as versionFile:
        for line in versionFile:
            if line.startswith("VERSION"):
                line = "VERSION = '{}'\n".format(version)
            if line.startswith("BUILD_DATE"):
                line = "BUILD_DATE = {}\n".format(newTime)
            newFile += line
    f = open('utilities/version.py', 'w+')
    for i in newFile:
        f.write(i)
    f.close()
    # Update server file
    newFile = ""
    with open('server/server.py', 'r') as versionFile:
        for line in versionFile:
            if line.startswith("VERSION"):
                line = "VERSION = '{}'\n".format(version)
            if line.startswith("BUILD_DATE"):
                line = "BUILD_DATE = {}\n".format(newTime)
            newFile += line
    f = open('server/server.py', 'w+')
    for i in newFile:
        f.write(i)
    f.close()
    with open('package.json') as package:
        data = json.load(package)
        data['version'] = version
        data['buildDate'] = newTime
    os.remove('package.json')
    with open('package.json', 'w') as package:
        json.dump(data, package, indent=2, sort_keys=True)
    logging.info('Version update complete')


if __name__ == "__main__":
    args = sys.argv
    if len(args) > 1:
        if args[1] == "patch":
            patchVersion()
        elif args[1] == "minor":
            minorVersion()
        else:
            logging.info("Could not recognize argument.")
    else:
        logging.info("Need arguments.")
