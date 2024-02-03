from django.contrib import admin
from .models import GymSession, Workout

# register the models so that they can be viewed in the admin panel
admin.site.register(GymSession)
admin.site.register(Workout)