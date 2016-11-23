from django.core.management.base import BaseCommand, CommandError

from django.db.models import Q
from climbingApp.models import *
from django.contrib.auth.models import User

import random
import datetime

class Command(BaseCommand):
  def add_arguments(self, parser):
    parser.add_argument('walls_per', type=int)
    parser.add_argument('routes_per', type=int)

  def handle(self, *args, **options):
    colors = Color.objects.all()
    difficulties = Difficulty.objects.all()
    outcomes = AscentOutcome.objects.all()
    users = User.objects.all()

    routes_per = options['routes_per']
    routes_per = min(5, max(1, routes_per))
    walls_per = options['walls_per']
    walls_per = min(30, max(1, walls_per))

    
    gym = Gym.objects.get(pk = 2)

    print("Clearing the old data")
    wQs = Wall.objects.filter(gym = gym)
    for w in wQs:
      rQs = Route.objects.filter(wall = w)
      for r in rQs:
        pass
      rQs.delete()
    wQs.delete()

    print("Adding the walls")
    for i in range(walls_per):
      w = Wall(gym = gym, name="F Gym {}".format(i+1))
      w.save()

    print("Adding the routes")
    today = datetime.date.today()
    start = today - datetime.timedelta(days = 365)

    while start < today:
      for w in Wall.objects.filter(gym_id = gym.id):
        existingRoutes = Route.objects.filter(wall = w, setDate__lte = start).filter(Q(removeDate__gt = start) | Q(removeDate__isnull=True))

        for i in range(existingRoutes.count(), routes_per):
          c = random.choice(colors)
          d = random.choice(difficulties)
          removeDate = start + datetime.timedelta(days = 7*random.randint(3, 6))
          if removeDate < today:
            r = Route(wall = w, color = c, difficulty = d, setDate = start, removeDate = removeDate)
          else:
            r = Route(wall = w, color = c, difficulty = d, setDate = start)
          r.save()

      start += datetime.timedelta(days = 7)

    print("Adding the ascents")
    today = datetime.date.today()
    start = today - datetime.timedelta(days = 350)

    while start < today:
      routes = list(Route.objects.filter(wall__gym = gym, setDate__lte = start, removeDate__gt = start))

      for u in users:
        for r in random.sample(routes, min(8, len(routes))):
          a = Ascent(route = r, user = u, date = start, outcome = random.choice(outcomes))
          a.save()
      start += datetime.timedelta(days = 3)
