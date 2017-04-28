import json
import requests
import os
import time
from multiprocessing import Process
from datetime import date
from sqlalchemy import create_engine
# import Aquaponics
from sessionManager import sessionScope
from models import Sensor, Reading, Log, User
import models
from shutil import copyfile

SENSORURL = "http://localhost:8000/api/sensor"
READINGURL = "http://localhost:8000/api/reading"
USERURL = "http://localhost:8000/api/user"


def BackupDatabase():
    backups = []
    lastBackup = None
    lastDate = [0, 0, 0]
    currentDate = str(date.today()).split('-')
    for dirpath, dirnames, filenames in os.walk('backups/'):
        backups = filenames
    if len(backups) <= 1:
        print "No previous databases found, starting from the begining of time."
        currentBackup = "backups/dragonfly_database_backup.{}-{}-{}.db".format(currentDate[2], currentDate[1], currentDate[0])

        dbURL = "sqlite:///{}".format(currentBackup)
        print 'initializing new database.'
        db = create_engine(dbURL)
        models.Base.metadata.create_all(db)
    else:
        print backups
        for i in backups:
            if i.startswith('.'):
                continue
            dates = i.split('.')[1].split('-')
            if int(dates[2]) > int(lastDate[2]):
                lastDate = dates
                lastBackup = i
            elif int(dates[2]) == int(lastDate[2]):
                if int(dates[1]) > int(lastDate[1]):
                    lastDate = dates
                    lastBackup = i
                elif int(dates[1]) == int(lastDate[1]):
                    if int(dates[0]) > int(lastDate[0]):
                        lastDate = dates
                        lastBackup = i
        print "Creating copy"
        src = os.path.join(dirpath, lastBackup)
        dest = "backups/dragonfly_database_backup.{}-{}-{}.db".format(currentDate[2], currentDate[1], currentDate[0])
        copyfile(src, dest)
        currentBackup = dest

    print "opening database"
    dbURL = "sqlite:///{}".format(currentBackup)
    with sessionScope(dbURL) as session:
        try:
            lastReading = session.query(Reading).order_by(Reading.created.desc()).first()
            print lastReading.toDict()
            startTime = lastReading.toDict()['created']
        except:
            print 'database was empty, setting time to 0.'
            startTime = 0
        print 'making request to api with start time: {}'.format(startTime)

        print "getting sensors"
        newSensors = requests.get(SENSORURL)
        print newSensors.json()
        for i in newSensors.json()['sensor_list']:
            try:
                newSensor = session.query(Sensor).filter_by(name=i['name']).one()
                print "sensor already exists: {}".format(i['name'])
            except:
                print "Sensor doesn't yet exist, adding: "
                print i
                newSensor = Sensor(name=i['name'])
                for j in i:
                    if j == 'name':
                        pass
                    elif j == 'created':
                        setattr(newSensor, j, int(i[j]))
                    else:
                        setattr(newSensor, j, i[j])
                session.add(newSensor)
                session.commit()

            print "Getting readings for {}".format(i['name'])
            url = "{}?sensor={}&start={}&end={}".format(READINGURL, i['name'], int(startTime), int(time.time()))
            print url
            newReadings = requests.get(url)
            for j in newReadings.json()['readings']:
                if j['created'] > int(startTime) + 1:
                    newReading = Reading(created=j['created'], sensor=newSensor.toDict()['name'], value=j['value'])
                    session.add(newReading)
        print "committing"
        session.commit()
        print 'all done!'


def RefreshDatabase():
    print "Restoring all data."
    backups = []
    lastBackup = None
    lastDate = [0, 0, 0]
    for dirpath, dirnames, filenames in os.walk('backups/'):
        backups = filenames
    for i in backups:
        if i.startswith('.'):
            continue
        dates = i.split('.')[1].split('-')
        if int(dates[2]) > int(lastDate[2]):
            lastDate = dates
            lastBackup = i
        elif int(dates[2]) == int(lastDate[2]):
            if int(dates[1]) > int(lastDate[1]):
                lastDate = dates
                lastBackup = i
            elif int(dates[1]) == int(lastDate[1]):
                if int(dates[0]) > int(lastDate[0]):
                    lastDate = dates
                    lastBackup = i
    print lastBackup
    dbURL = "sqlite:///{}".format(os.path.join('backups', lastBackup))
    with sessionScope(dbURL) as session:
        sensors = session.query(Sensor).all()
        errors = []
        for i in sensors:

            print 'adding readings for {}'.format(i.toDict()['name'])
            readings = session.query(Reading).filter_by(sensor=i.toDict()['name'])
            reads = {
                'sensor': i.toDict(),
                'readings': []
            }
            for i in readings:
                if len(reads['readings']) > 1000:
                    response = requests.post(READINGURL, json.dumps(reads))
                    print response
                    if response.status_code != 200:
                        errors.append(reads)
                    reads['readings'] = []
                reads['readings'].append({
                    "value": i.toDict()['value'],
                    "timestamp": i.toDict()['created']
                })

            print "making post"
            print len(reads['readings'])
            response = requests.post(READINGURL, json.dumps(reads))
            print response
        for i in errors:
            print 'err'
            response = requests.post(READINGURL, json.dumps(i))
            print response

        print "Adding users."
        users = session.query(User).all()
        for i in users:
            response = requests.post(USERURL, json.dumps({
                'user': i.name,
                'password': i.password
            }))
            print response
