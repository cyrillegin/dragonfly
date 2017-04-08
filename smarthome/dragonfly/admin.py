from django.contrib import admin

# Register your models here.
from .models import Sensor, Reading

admin.site.register(Sensor)
admin.site.register(Reading)
