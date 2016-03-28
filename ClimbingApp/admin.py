from django.contrib import admin

from .models import *

admin.site.register(Gym)
admin.site.register(Wall)
admin.site.register(Route)
admin.site.register(Ascent)

admin.site.register(Color)
admin.site.register(Difficulty)
admin.site.register(AscentOutcome)
