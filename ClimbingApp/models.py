from django.core.exceptions import ValidationError
from django.db import models

import wand.image
import wand.drawing
import wand.color
import io

from django.core.files.base import ContentFile
from django.contrib.auth.models import User, Group, Permission

# Create your models here.
def color_image_path(instance, filename):
  return 'colors/%i.png' % (instance.id or 0, )

class Color(models.Model):
  name = models.CharField(max_length = 32)
  r_inner = models.PositiveSmallIntegerField()
  g_inner = models.PositiveSmallIntegerField()
  b_inner = models.PositiveSmallIntegerField()
  r_outer = models.PositiveSmallIntegerField(blank = True, null = True)
  g_outer = models.PositiveSmallIntegerField(blank = True, null = True)
  b_outer = models.PositiveSmallIntegerField(blank = True, null = True)
  image = models.ImageField(upload_to=color_image_path, blank = True)

  def clean(self):
    if (self.r_outer is None or self.g_outer is None or self.b_outer is None) and not (self.r_outer is None and self.g_outer is None and self.b_outer is None):
      raise ValidationError('All or non of the outer colors must be defined')

    self.image.save("filename", ContentFile(self.draw_image()))

  def draw_image(self):
    with wand.drawing.Drawing() as draw:
      with wand.color.Color('rgb(%i,%i,%i)' % (self.r_inner, self.g_inner, self.b_inner)) as inner:
        draw.fill_color = inner
        draw.rectangle(left = 0, right = 39, top = 0, bottom = 39)

      if self.r_outer:
        with wand.color.Color('rgb(%i,%i,%i)' % (self.r_outer, self.g_outer, self.b_outer)) as outer:
          draw.fill_color = outer 
          draw.rectangle(left = 0, right = 39, top = 0, bottom = 11)
          draw.rectangle(left = 0, right = 39, top = 27, bottom = 39)

      with wand.image.Image(width = 40, height = 40) as im:
        draw(im)
        return im.make_blob(format = 'png')

  def __str__(self):
    return self.name

class Difficulty(models.Model):
  name = models.CharField(max_length = 32)

  def __str__(self):
    return self.name

class AscentOutcome(models.Model):
  name = models.CharField(max_length = 32)

  def __str__(self):
    return self.name


######################
class Gym(models.Model):
  name = models.CharField(max_length = 32)

  def __str__(self):
    return self.name

class Wall(models.Model):
  name = models.CharField(max_length = 32)
  gym  = models.ForeignKey(Gym, related_name="walls")

  def __str__(self):
    return self.name

class Route(models.Model):
  wall = models.ForeignKey(Wall, related_name="routes")
  color = models.ForeignKey(Color)
  difficulty = models.ForeignKey(Difficulty)
  setDate = models.DateField(auto_now_add = True)
  removeDate = models.DateField()

  def __str__(self):
    return "{} - {}".format(str(self.color) , str(self.difficulty))

class Ascent(models.Model):
  route = models.ForeignKey(Route)
  user = models.ForeignKey(User)
  date  = models.DateField(auto_now_add = True)
  comments = models.TextField()
  outcome = models.ForeignKey(AscentOutcome)

  def __str__(self):
    return "{0} - {1}".format(self.route, date)
