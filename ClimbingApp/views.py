# Create your views here.
from django.shortcuts import render, get_object_or_404

from models import *

def home(request):
  return render(request, 'ClimbingApp/index.html')

def viewGym(request, gymID):
  gymObject = get_object_or_404(Gym, id = gymID)
  wallsSet  = gymObject.wall_set.all()
  return render(request, 'ClimbingApp/viewGym.html', {
    'gym':   gymObject,
    'walls': wallsSet,
  })

def viewWall(request, wallID):
  wallObject = get_object_or_404(Wall, id = wallID)
  routeSet = wallObject.route_set.all()
  return render(request, 'ClimbingApp/viewWall.html', {
    'gym':    wallObject.gym,
    'wall':   wallObject,
    'routes': routeSet,
  })


def viewRoute(request, routeID):
  routeObject = get_object_or_404(Route, id = routeID)

  return render(request, 'ClimbingApp/viewRoute.html', {
    'gym':   routeObject.wall.gym,
    'wall':  routeObject.wall,
    'route': routeObject,
  })
