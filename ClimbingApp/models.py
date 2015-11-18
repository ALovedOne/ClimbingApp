from django.db import models

# Create your models here.

class Gym(models.Model):
  name = models.CharField(max_length = 32)

  def __str__(self):
    return self.name


class Wall(models.Model):
  name = models.CharField(max_length = 32)
  gym  = models.ForeignKey(Gym)

  def __str__(self):
    return self.name

class Color(models.Model):
  color = models.CharField(max_length = 32)

  def __str__(self):
    return self.color

class Route(models.Model):
  color = models.ForeignKey(Color)
  wall = models.ForeignKey(Wall)

  def __str__(self):
    return str(self.color)

class Assent(models.Model):
  route = models.ForeignKey(Route)
  date  = models.DateField(auto_now = True, auto_now_add = True)

  def __str__(self):
    return "{0} - {1}".format(self.route, date)
