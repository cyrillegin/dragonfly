from django.core.management.base import BaseCommand
from dragonfly import models


class Command(BaseCommand):
    help = 'Load a days worth of data.'

    def handle(self, *args, **options):
        print "start"
        obj = models.Reading.objects.datetimes('created', 'hour')
        for i in obj:
            print i

        # objects.filter(datetime = 5 mintues)
