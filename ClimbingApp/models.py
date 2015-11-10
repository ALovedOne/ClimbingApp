from django.db import models

# Create your models here.

class Gym(models.Model):
  name = models.CharField(max_length = 32)


class Wall(models.Model):
  name = models.CharField(max_length = 32)
  gym  = models.ForeignKey(Gym)

class Color(models.Model):
  color = models.CharField(max_length = 32)

class Route(models.Model):
  color = models.ForeignKey(Color)
  wall = models.ForeignKey(Wall)

class Assent(models.Model):
  route = models.ForeignKey(Route)
  date  = models.DateField(auto_now = True, auto_now_add = True)
