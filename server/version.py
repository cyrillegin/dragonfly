import time
import json
import os

VERSION = '0.8.5'
BUILD_DATE = 1519672994.49


def minorVersion(*args):
    print "Current version: {}".format(VERSION)
    version = VERSION.split('.')
    version[2] = str(int(version[2]) + 1)
    version = ".".join(version)
    saveVersion(version)


def majorVersion(*args):
    print "Current version: {}".format(VERSION)
    version = VERSION.split('.')
    version[1] = str(int(version[1]) + 1)
    version[2] = "0"
    version = ".".join(version)
    saveVersion(version)


def saveVersion(version):
    newTime = time.time()
    print "New version is: {}".format(version)
    newFile = ""
    with open('server/version.py', 'r') as versionFile:
        for line in versionFile:
            if line.startswith("VERSION"):
                line = "VERSION = '{}'\n".format(version)
            if line.startswith("BUILD_DATE"):
                line = "BUILD_DATE = {}\n".format(newTime)
            newFile += line
    f = open('server/version.py', 'w')
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
