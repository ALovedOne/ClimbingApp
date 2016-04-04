from django.contrib import admin

from .models import *

admin.site.register(Gym)
admin.site.register(Wall)
admin.site.register(Route)
admin.site.register(Ascent)

class ColorAdmin(admin.ModelAdmin):
  fields = ('name', ('r_inner', 'g_inner', 'b_inner'), ('r_outer', 'g_outer', 'b_outer'))
  list_display = ('name', 'r_inner', 'g_inner', 'b_inner')
admin.site.register(Color, ColorAdmin)

admin.site.register(Difficulty)
admin.site.register(AscentOutcome)
