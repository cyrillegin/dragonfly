from django.core.management.base import BaseCommand
from dragonfly import models

whitelist = ['weatherstation', 'aquaLight', 'ovenTemp', 'lightSwitch', 'waterTurb', 'plantLight', 'waterTemp', ]


class Command(BaseCommand):
    help = 'Load a days worth of data.'

    def handle(self, *args, **options):
        print "cleaning inputs"
        sensors = models.Sensor.objects.all()
        for i in sensors:
            print "cleaning: {}".format(i.toDict()['name'])
            if i.toDict()['name'] not in whitelist:
                print 'Sensor not in whitelist: {}'.format(i.toDict()['name'])
                print "would you like to delete it? (y,n)"
                ans = raw_input('--> ')
                if ans == "y":
                    print "deleting {}".format(i.toDict()['name'])
                    i.delete()
                elif ans == "n":
                    print "skipping"
                else:
                    print "I didn't understand, quiting"
                    break
        print "Done checking sensors, begin readings check.(This may take a while"
        readings = models.Reading.objects.all()
        count = 0
        for i in readings:
            count += 1
            if count % 1000 == 0:
                print "readings checked: {}".format(count)
            reading = i.toDict()
            if reading['sensor']['name'] not in whitelist:
                print "\n"
                print json.dumps(i.toDict(), indent=2)
                print " does not have a sensor that matches whitelist, delete? (y,n)"
                ans = raw_input('--> ')
                if ans == "y":
                    print "deleting {}".format(i.toDict())
                    i.delete()
                elif ans == "n":
                    print "skipping"
                else:
                    print "I didn't understand, quiting"
                    break
