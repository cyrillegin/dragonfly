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
                print "you said: {}".format(ans)
                if ans == "y":
                    print "deleting {}".format(i.toDict()['name'])
                    i.delete()
                elif ans == "n":
                    print "skipping"
                else:
                    print "I didn't understand, quiting"
                    break
