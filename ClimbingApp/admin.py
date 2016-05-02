from django.contrib import admin

from .models import *

admin.site.register(Gym)

class WallAdmin(admin.ModelAdmin):
  list_display = ('name', 'gym')
  ordering = ('sort_name', )
  list_filter = ('gym', )
admin.site.register(Wall, WallAdmin)

admin.site.register(Route)
admin.site.register(Ascent)

class ColorAdmin(admin.ModelAdmin):
  fields = ('name', ('inner_r', 'inner_g', 'inner_b'), ('outer_r', 'outer_g', 'outer_b'))
  list_display = ('name', 'inner_r', 'inner_g', 'inner_b')
admin.site.register(Color, ColorAdmin)

class DifficultyAdmin(admin.ModelAdmin):
  list_display = ('name', )
  ordering = ('sort_name', )
admin.site.register(Difficulty, DifficultyAdmin)

admin.site.register(AscentOutcome)

# ModelAdmin.list_editable
