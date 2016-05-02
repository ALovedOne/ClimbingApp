from django.contrib import admin

from .models import *

admin.site.register(Gym)

class WallAdmin(admin.ModelAdmin):
  list_display = ('name', 'gym')
  ordering = ('sort_name', )
  list_filter = ('gym', )
admin.site.register(Wall, WallAdmin)

class RouteAdmin(admin.ModelAdmin):
  list_display = ('route_name', 'wall', 'setDate', 'removeDate')
  ordering = ('wall', '-removeDate', '-setDate')
  list_filter = ('wall__gym', 'wall')

  def route_name(self, obj):
    return str(obj)
admin.site.register(Route, RouteAdmin)

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
