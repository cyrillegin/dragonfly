from django.db import models


class Sensor(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    coefficients = models.TextField(blank=True, default='')
   
    class Meta:
        ordering = ('created',)


class Reading(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    sensor = models.ForeignKey(Sensor, related_name='readings', on_delete=models.CASCADE)
    value = models.FloatField(null=False, blank=False)

    class meta:
        unique_together = ('album', 'order')
        ordering = ('created',)

    def __unicode__(self):
        return '%d: %s' % (self.order, self.title)
