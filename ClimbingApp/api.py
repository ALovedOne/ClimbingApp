from tastypie import fields
from tastypie.api import Api
from tastypie.authentication import ApiKeyAuthentication
from tastypie.exceptions import NotFound
from tastypie.models import create_api_key
from tastypie.resources import ModelResource
from tastypie.utils import trailing_slash

from django.conf.urls import url, include
from django.contrib.auth.models import User
from django.db.models import signals

from .models import *

api = Api(api_name = 'v1')

class RouteResource(ModelResource):
  class Meta:
    queryset = Route.objects.all()
    resource_name = "routes"
    #authentication = ApiKeyAuthentication()

  def obj_get_list(self, bundle, **kwargs):
    qs = super(ModelResource, self).obj_get_list(bundle, **kwargs)
    if 'pk_walls' in kwargs:
      qs = qs.filter(wall_id = kwargs['pk_walls'])
    return qs

api.register(RouteResource())

class WallResource(ModelResource):
  class Meta:
    queryset = Wall.objects.all()
    resource_name = "walls"
    #authentication = ApiKeyAuthentication()

  def obj_get_list(self, bundle, **kwargs):
    qs = super(ModelResource, self).obj_get_list(bundle, **kwargs)
    if 'pk_gyms' in kwargs:
      qs = qs.filter(gym_id = kwargs['pk_gyms'])
    return qs

  def prepend_urls(self):
    ret = [
      url(r"^(?P<resource_name_%s>%s)/(?P<pk_%s>\w*[\w/-])/" % (
        self._meta.resource_name, 
        self._meta.resource_name, 
        self._meta.resource_name), include(RouteResource().urls)),
    ]
    return ret
api.register(WallResource())

class GymResource(ModelResource):
  class Meta:
    queryset = Gym.objects.all()
    resource_name = "gyms"
    #authentication = ApiKeyAuthentication()
    filter = {
      'gym': ('exact', ),
    }

  def prepend_urls(self):
    ret = [
      url(r"^(?P<resource_name_%s>%s)/(?P<pk_%s>\w*[\w/-])/" % (
        self._meta.resource_name, 
        self._meta.resource_name, 
        self._meta.resource_name), include(WallResource().urls)),
    ]
    return ret
api.register(GymResource())

class AscentResource(ModelResource):
  class Meta:
    queryset = Ascent.objects.all()
    resource_name = "ascents"
    #authentication = ApiKeyAuthentication()
api.register(AscentResource())

class ColorResource(ModelResource):
  class Meta:
    queryset = Color.objects.all()
    resource_name = "colors"
    #authentication = ApiKeyAuthentication()
api.register(ColorResource())

class DifficultyResource(ModelResource):
  class Meta:
    queryset = Difficulty.objects.all()
    resource_name = "difficulties"
    #authentication = ApiKeyAuthentication()
api.register(DifficultyResource())

class AscentOutcomeResource(ModelResource):
  class Meta:
    queryset = AscentOutcome.objects.all()
    resource_name = "ascent_outcomes"
    #authentication = ApiKeyAuthentication()
api.register(AscentOutcomeResource())

class UserResource(ModelResource):
  class Meta:
    queryset = User.objects.all()
    resource_name = "users"
    authentication = ApiKeyAuthentication()
    excludes = ['email', 'password', 'is_superuser']

  def obj_get(self, bundle, **kwargs):
    if kwargs['pk'] != 'me':
      return super(ModelResource, self).obj_get(bundle, **kwargs)
    if not bundle.request.user.is_authenticated():
      raise NotFound("User not logged in")
    return bundle.request.user

api.register(UserResource())

signals.post_save.connect(create_api_key, sender=User)

apiUrls = api.urls
