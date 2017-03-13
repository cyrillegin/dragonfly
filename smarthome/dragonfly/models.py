from django.db import models

# possible sensor types:
# temperature: displays a gauge graph
# cleanliness: shows a beaker with varying degrees of water color
# lightsensor: shows a sun animation
# lightswitch: shows a lightbulb


class Sensor(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    coefficients = models.TextField(blank=True, default='')
    sensor_type = models.TextField(blank=False, null=False, default='')
    units = models.TextField(blank=True, default='')
    last_reading = models.FloatField(blank=True, default=0)

    class Meta:
        ordering = ('created',)

    def toDict(self):
        return {
            "created": self.created,
            "name": self.name,
            "description": self.description,
            "coefficients": self.coefficients,
            "self_type": self.sensor_type,
            "units": self.units,
            "lastReading": self.last_reading
        }


class Reading(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    sensor = models.ForeignKey(Sensor, related_name='readings', on_delete=models.CASCADE)
    value = models.FloatField(null=False, blank=False)

    class Meta:
        ordering = ('created',)

    def __unicode__(self):
        return '%d: %s' % (self.order, self.title)

    def toDict(self):
        return {
            "created": self.created,
            "sensor": self.sensor.toDict(),
            "value": self.value
        }


class Log(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.TextField(blank=False, null=False)
    description = models.TextField(blank=False, null=False)

    class Meta:
        ordering = ('created', )

    def toDict(self):
        return {
            'created': self.created,
            'title': self.title,
            'description': self.description
        }
