import json
import requests
import os
SENSORURL = "https://dragonf1y.herokuapp.com/api/sensor"
READINGURL = "https://dragonf1y.herokuapp.com/api/reading"


"""
TO START:
download database

create fresh data base
pull all data from 0 to current date for a model.
on completetion, start a new process to save the data
pull all data from next model and repeate

recreate database

pull all data for a model in database
on completion, start new process and upload data
pull data from next model

FUTURE:
download database
pull all database from last backup
get last time of entry



database naming scheme:

dragonfly_database_backup.DD-MM-YY
"""


def BackupDatabase():
    backups = []
    startTime = 0
    lastBackup = None
    lastDate = [0, 0, 0]
    for dirpath, dirnames, filenames in os.walk('backups/'):
        backups = filenames
    if len(backups) == 0:
        print "No previous databases found, starting from the begining of time."
    else:

        for i in backups:
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
        print lastDate
        print lastBackup



def RefreshDatabase():
    pass
