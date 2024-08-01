from django.contrib import admin

from .models import Appointment, Schedule

# Register your models here.

admin.site.register(Appointment)
admin.site.register(Schedule)
