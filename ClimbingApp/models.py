from django.core.exceptions import ValidationError
from django.db import models

from datetime import date

import io
import wand.color
import wand.drawing
import wand.image

from django.core.files.base import ContentFile
from django.contrib.auth.models import User, Group, Permission

# Create your models here.
def color_image_path(instance, filename):
  return 'colors/%i.png' % (instance.id or 0, )

class Color(models.Model):
  name = models.CharField(max_length = 32)
  inner_r = models.PositiveSmallIntegerField()
  inner_g = models.PositiveSmallIntegerField()
  inner_b = models.PositiveSmallIntegerField()
  outer_r = models.PositiveSmallIntegerField(blank = True, null = True)
  outer_g = models.PositiveSmallIntegerField(blank = True, null = True)
  outer_b = models.PositiveSmallIntegerField(blank = True, null = True)
  image = models.ImageField(upload_to=color_image_path, blank = True)

  def clean(self):
    if (self.outer_r is None or self.outer_g is None or self.outer_b is None) and not (self.outer_r is None and self.outer_g is None and self.outer_b is None):
      raise ValidationError('All or non of the outer colors must be defined')

    self.image.save("filename", ContentFile(self.draw_image()))

  def draw_image(self):
    with wand.drawing.Drawing() as draw:
      with wand.color.Color('rgb(%i,%i,%i)' % (self.inner_r, self.inner_g, self.inner_b)) as inner:
        draw.fill_color = inner
        draw.rectangle(left = 0, right = 39, top = 0, bottom = 39)

      if self.outer_r:
        with wand.color.Color('rgb(%i,%i,%i)' % (self.outer_r, self.outer_g, self.outer_b)) as outer:
          draw.fill_color = outer 
          draw.rectangle(left = 0, right = 39, top = 0, bottom = 10)
          draw.rectangle(left = 0, right = 39, top = 28, bottom = 39)

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
  image = models.ImageField(upload_to='ascent_outcome/')

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
  setDate = models.DateField(default = date.today)
  removeDate = models.DateField(null = True)
  #TODO - setDate__lte = start, removeDate__gt = start

  def clean(self):
    if self.setDate >= self.removeDate:
      raise ValidationError("setDate must be after the removeDate")


  def __str__(self):
    return "{} - {}".format(str(self.color) , str(self.difficulty))

class Ascent(models.Model):
  route = models.ForeignKey(Route)
  user = models.ForeignKey(User)
  date  = models.DateField(default = date.today)
  comments = models.TextField()
  outcome = models.ForeignKey(AscentOutcome)

  def __str__(self):
    return "{0} - {1}".format(self.route, self.date)
