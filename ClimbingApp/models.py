from django.db import models

# Create your models here.

class Color(models.Model):
  name = models.CharField(max_length = 32)
  r = models.PositiveSmallIntegerField()
  g = models.PositiveSmallIntegerField()
  b = models.PositiveSmallIntegerField()

  def __str__(self):
    return self.name

class Difficulty(models.Model):
  name = models.CharField(max_length = 32)

  def __str__(self):
    return self.name

class AscentOutcomes(models.Model):
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
  gym  = models.ForeignKey(Gym)

  def __str__(self):
    return self.name

class Route(models.Model):
  wall = models.ForeignKey(Wall)
  color = models.ForeignKey(Color)
  difficulty = models.ForeignKey(Difficulty)
  setDate = models.DateField(auto_now_add = True)
  removeDate = models.DateField()

  def __str__(self):
    return str(self.color)

class Assent(models.Model):
  route = models.ForeignKey(Route)
  # TODO User
  date  = models.DateField(auto_now_add = True)
  comments = models.TextField()


  def __str__(self):
    return "{0} - {1}".format(self.route, date)
