from tastypie.resources import ModelResource
from tastypie.api import Api

from .models import *

api = Api(api_name = 'v1')

class GymResource(ModelResource):
  class Meta:
    queryset = Gym.objects.all()
    resource_name = "gyms"
api.register(GymResource())

class WallResource(ModelResource):
  class Meta:
    queryset = Wall.objects.all()
    resource_name = "walls"
api.register(WallResource())

class RouteResource(ModelResource):
  class Meta:
    queryset = Route.objects.all()
    resource_name = "routes"
api.register(RouteResource())

class AscentResource(ModelResource):
  class Meta:
    queryset = Ascent.objects.all()
    resource_name = "ascents"
api.register(AscentResource())

apiUrls = api.urls
