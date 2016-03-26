# Create your views here.
from django.shortcuts import render, get_object_or_404

from rest_framework import generics

from .models import *
from .serializers import *

class GymList(generics.ListCreateAPIView):
  queryset = Gym.objects.all()
  serializer_class = GymSerializer


def home(request):
  gymObjects = Gym.objects.all()
  return render(request, 'ClimbingApp/index.html', {
    'gyms': gymObjects,
  })

def viewGym(request, gymID):
  gymObject = get_object_or_404(Gym, id = gymID)
  wallsSet  = gymObject.wall_set.all()
  return render(request, 'ClimbingApp/viewGym.html', {
    'gym':   gymObject,
    'walls': wallsSet,
  })

def addWall(request, gymID):
  gymObject = get_object_or_404(Gym, id = gymID)
  return render(request, 'ClimbingApp/addGym.html', {

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
