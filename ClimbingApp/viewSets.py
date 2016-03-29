# Create your views here.
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import *
from .serializers import *

class GymList(viewsets.ModelViewSet):
  queryset = Gym.objects.all()
  serializer_class = GymSerializer

class WallList(viewsets.ModelViewSet):
  queryset = Wall.objects.all()
  serializer_class = WallSerializer

class GymWallList(viewsets.ModelViewSet):
  serializer_class = WallSerializer

  def get_queryset(self, *args, **kwargs):
    gymId = self.kwargs['gym_pk']
    return Wall.objects.filter(gym_id = gymId)

class GymWallRouteViewSet(viewsets.ModelViewSet):
  serializer_class = RouteSerializer

  def get_queryset(self):
    gymId = self.kwargs['gym_pk']
    wallId = self.kwargs['wall_pk']
    return Route.objects.filter(wall_id = wallId)

class GymWallRouteAscentList(viewsets.ModelViewSet):
  serializer_class = AscentSerializer

  def get_queryset(self):
    gymId = self.kwargs['gym_pk']
    wallId = self.kwargs['wall_pk']
    routeId = self.kwargs['route_pk']
    return Ascent.objects.filter(route_id = routeId)

class RouteList(viewsets.ModelViewSet):
  queryset = Route.objects.all()
  serializer_class = RouteSerializer

class AscentList(viewsets.ModelViewSet):
  queryset = Ascent.objects.all()
  serializer_class = AscentSerializer

class ColorList(viewsets.ModelViewSet):
  queryset = Color.objects.all()
  serializer_class = ColorSerializer

class DifficultyList(viewsets.ModelViewSet):
  queryset = Difficulty.objects.all()
  serializer_class = DifficultySerializer

class AscentOutcomeList(viewsets.ModelViewSet):
  queryset = AscentOutcome.objects.all()
  serializer_class = AscentOutcomeSerializer

@api_view()
def get_user(request):
  return Response(UserSerializer(request.user).data)
