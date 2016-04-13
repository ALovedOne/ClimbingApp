from tastypie import fields
from tastypie.api import Api
from tastypie.authentication import ApiKeyAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.exceptions import NotFound
from tastypie.models import create_api_key
from tastypie.resources import ModelResource
from tastypie.utils import trailing_slash

from django.conf.urls import url, include
from django.contrib.auth.models import User
from django.db.models import signals

from .models import *

api = Api(api_name = 'v1')

class UserResource(ModelResource):
  class Meta:
    queryset = User.objects.all()
    resource_name = "users"
    authentication = ApiKeyAuthentication()
    authorization = Authorization()
    always_return_data = True
    excludes = ['email', 'password', 'is_superuser']

  def obj_get(self, bundle, **kwargs):
    if kwargs['pk'] != 'me':
      return super(ModelResource, self).obj_get(bundle, **kwargs)
    if not bundle.request.user.is_authenticated():
      raise NotFound("User not logged in")
    return bundle.request.user
api.register(UserResource())

signals.post_save.connect(create_api_key, sender=User)

# Utility resources
class ColorResource(ModelResource):
  class Meta:
    queryset = Color.objects.all()
    resource_name = "colors"
    authentication = ApiKeyAuthentication()
    authorization = Authorization()
    always_return_data = True
api.register(ColorResource())

class DifficultyResource(ModelResource):
  class Meta:
    queryset = Difficulty.objects.all()
    resource_name = "difficulties"
    authentication = ApiKeyAuthentication()
    authorization = Authorization()
    always_return_data = True
api.register(DifficultyResource())

class AscentOutcomeResource(ModelResource):
  class Meta:
    queryset = AscentOutcome.objects.all()
    resource_name = "ascent_outcomes"
    authentication = ApiKeyAuthentication()
    authorization = Authorization()
    always_return_data = True
api.register(AscentOutcomeResource())

class GymResource(ModelResource):
  class Meta:
    queryset = Gym.objects.all().order_by('name')
    resource_name = "gyms"
    authentication = ApiKeyAuthentication()
    authorization = Authorization()
    always_return_data = True
    filtering = {
      'name': ALL,
    }
    ordering = "name"
api.register(GymResource())

class WallResource(ModelResource):
  class Meta:
    queryset = Wall.objects.all().order_by('name')
    resource_name = "walls"
    authentication = ApiKeyAuthentication()
    authorization = Authorization()
    always_return_data = True
    filtering = {
      'name': ALL,
      'gym': 'exact',
    }
    ordering = "name"
  gym = fields.ForeignKey(GymResource, 'gym')
api.register(WallResource())

class RouteResource(ModelResource):
  class Meta:
    queryset = Route.objects.order_by('-setDate')
    resource_name = "routes"
    authentication = ApiKeyAuthentication()
    authorization = Authorization()
    always_return_data = True
    filtering = {
      'wall': 'exact',
    }
  wall = fields.ForeignKey(WallResource, 'wall')
  color = fields.ForeignKey(ColorResource, 'color', full = True)
  difficulty = fields.ForeignKey(DifficultyResource, 'difficulty', full = True)

  #def get_list(self):
  #  print("HI")
  #  qs = super(ModelResource, self).obj_get_list(bundle, **kwargs)
  #  return qs.filter(Q(removeDate__gt = date.today()) | Q(removeDate__isnull=True))
api.register(RouteResource())

class AscentResource(ModelResource):
  class Meta:
    queryset = Ascent.objects.all()
    resource_name = "ascents"
    authentication = ApiKeyAuthentication()
    authorization = Authorization()
    always_return_data = True
    filtering = {
      'route': 'exact',
    }
  route = fields.ForeignKey(RouteResource, 'route')
  outcome = fields.ForeignKey(AscentOutcomeResource, 'outcome', full = True)
  user = fields.ForeignKey(UserResource, 'user', full = True)
api.register(AscentResource())


apiUrls = api.urls
