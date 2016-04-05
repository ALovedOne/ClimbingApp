from django.contrib import admin

from .models import *

admin.site.register(Gym)
admin.site.register(Wall)
admin.site.register(Route)
admin.site.register(Ascent)

class ColorAdmin(admin.ModelAdmin):
  fields = ('name', ('inner_r', 'inner_g', 'inner_b'), ('outer_r', 'outer_g', 'outer_b'))
  list_display = ('name', 'inner_r', 'inner_g', 'inner_b')
admin.site.register(Color, ColorAdmin)

admin.site.register(Difficulty)
admin.site.register(AscentOutcome)
