import datetime

from tastypie import fields
from tastypie.api import Api
from tastypie.authentication import Authentication, ApiKeyAuthentication, MultiAuthentication
from tastypie.authorization import DjangoAuthorization
from tastypie.constants import ALL
from tastypie import exceptions
from tastypie import http 
from tastypie.models import create_api_key, ApiKey
from tastypie.resources import ModelResource

from django.conf.urls import url
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import signals, Q

from .models import *

import time

api = Api(api_name = 'v1')

class LoginCanEditAuth(DjangoAuthorization):
  def read_list(self, obj_list, bundle):
    return obj_list

  def read_detail(self, obj_list, bundle):
    return True

class UserCanEditSelfAuth(DjangoAuthorization):

  def read_list(self, object_list, bundle):
    return object_list

  def read_detail(self, object_list, bundle):
    return True

  # def create_list(self, object_list, bundle):

  def create_detail(self, object_list, bundle):
    raise exceptions.ImmediateHttpResponse(response = http.HttpNotImplemented())

  #def update_list(self, object_list, bundle):

  def update_detail(self, object_list, bundle):
    return bundle.obj == bundle.request.user

  # def delete_list(self, object_list, bundle):

  # def delete_detail(self, object_list, bundle):

class UserResource(ModelResource):
  class Meta:
    queryset = User.objects.all()
    resource_name = "users"
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
    authorization = UserCanEditSelfAuth()
    always_return_data = True
    excludes = ['email', 'password', 'is_superuser']

  def obj_get(self, bundle, **kwargs):
    if not bundle.request.user.is_authenticated():
      raise exceptions.ImmediateHttpResponse(response = http.HttpUnauthorized("User not logged in"))
    return bundle.request.user

  def login(self, request, **kwargs):
    self.method_check(request, allowed = ['post'])

    data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))

    username = data.get('username', '')
    password = data.get('password', '')

    user = authenticate(username=username, password=password)
    if user:
      apiKey = self.get_or_create_apikey(user)
      return self.__makeAuthResponse(request, user, apiKey.key)
    return self.create_response(request, {
      'success': False
    }, http.HttpUnauthorized)

  def me(self, request, **kwargs):
    username = request.GET.get("username", "")
    apiKey   = request.GET.get("apiKey", "")

    key = ApiKey.objects.get(key = apiKey, user__username = username)
    return self.__makeAuthResponse(request, key.user, key.key)

  def __makeAuthResponse(self, request, user, apiKey):
    bundle = self.build_bundle(obj = user, request = request)
    return self.create_response(request, {
        'success':  True,
        'apiKey':   apiKey,
        'user':     self.full_dehydrate(bundle),
        'permissions': list(user.get_all_permissions()),
    })

  def get_or_create_apikey(self, userInstance):
    key = ApiKey.objects.get(user = userInstance)
    if key:
      return key
    else:
      return ApiKey.objects.create(user = userInstance)

  def prepend_urls(self):
    return [
      url(r"^(?P<resource_name>%s)/login/$" % self._meta.resource_name, self.wrap_view('login')),
      url(r"^(?P<resource_name>%s)/me/$" % self._meta.resource_name, self.wrap_view('me')),
    ]
api.register(UserResource())

signals.post_save.connect(create_api_key, sender=User)

# Utility resources
class ColorResource(ModelResource):
  class Meta:
    queryset = Color.objects.all().order_by('name')
    resource_name = "colors"
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
    authorization = LoginCanEditAuth()
    always_return_data = True
api.register(ColorResource())

class DifficultyResource(ModelResource):
  class Meta:
    queryset = Difficulty.objects.all().order_by('sort_name')
    resource_name = "difficulties"
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
    authorization = LoginCanEditAuth()
    always_return_data = True
    ordering = 'sort_name'
api.register(DifficultyResource())

class AscentOutcomeResource(ModelResource):
  class Meta:
    queryset = AscentOutcome.objects.all()
    resource_name = "ascent_outcomes"
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
    authorization = LoginCanEditAuth()
    always_return_data = True
api.register(AscentOutcomeResource())

class GymResource(ModelResource):
  sort_name = fields.CharField('sort_name', readonly = True)

  class Meta:
    queryset = Gym.objects.all().order_by('sort_name')
    resource_name = "gyms"
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
    authorization = LoginCanEditAuth()
    always_return_data = True
    filtering = {
      'name': ALL,
    }
    ordering = "sort_name"

  def hydrate(self, bundle):
    bundle.obj.sort_name = slugify(bundle.data['name'].replace(' ', '_')).upper()
    return bundle

api.register(GymResource())

class WallResource(ModelResource):
  class Meta:
    queryset = Wall.objects.all().order_by('sort_name')
    resource_name = "walls"
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
    authorization = LoginCanEditAuth()
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
    queryset = Route.objects.all().order_by('-setDate')
    resource_name = "routes"
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
    authorization = LoginCanEditAuth()
    always_return_data = True
    filtering = {
      'wall':  'exact',
      'gym':   'exact',
      'active':'exact',
    }
  wall = fields.ForeignKey(WallResource, 'wall')
  color = fields.ForeignKey(ColorResource, 'color', full = True)
  difficulty = fields.ForeignKey(DifficultyResource, 'difficulty', full = True)

  def apply_filters(self, request, filters, **kwargs):
    active = None

    if 'active' in filters:
      active = filters.pop('active')

    qs = super(RouteResource, self).apply_filters(request, filters, **kwargs)

    if active == True: 
      today = datetime.date.today()
      qs = qs.filter(Q(removeDate__gt = today) | Q(removeDate = None))
    if active == False:
      today = datetime.date.today()
      qs = qs.filter(removeDate__lt = today)

    return qs

  def build_filters(self, filters = None, **kwargs):
    if filters is None:
      filters = {}

    orm_filters = super(RouteResource, self).build_filters(filters, **kwargs)

    if 'gym' in filters:
      orm_filters['wall__gym_id'] = filters.get('gym')

    if 'active' in filters:
      if filters['active'] == 'false':
        orm_filters['active'] = False
      if filters['active'] == 'true':
        orm_filters['active'] = True

    return orm_filters

api.register(RouteResource())

class AscentResource(ModelResource):
  class Meta:
    queryset = Ascent.objects.all()
    resource_name = "ascents"
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
    authorization = LoginCanEditAuth()
    always_return_data = True
    filtering = {
      'route': 'exact',
      'user': 'exact',
      'outcome': ALL, 
      'date': ALL
    }
  route = fields.ForeignKey(RouteResource, 'route', full = True)
  outcome = fields.ForeignKey(AscentOutcomeResource, 'outcome', full = True)
  user = fields.ForeignKey(UserResource, 'user', full = True)

  def apply_filters(self, request, filters, **kwargs):
    mine = True

    if 'mine' in filters:
      mine = filters.pop('mine') == 'true'

    qs = super(AscentResource, self).apply_filters(request, filters, **kwargs)

    if mine:
      qs = qs.filter(user_id = request.user.id)

    return qs

  def build_filters(self, filters = None, **kwargs):
    if filters is None:
      filters = {}

    orm_filters = super(AscentResource, self).build_filters(filters, **kwargs)

    if 'gym' in filters:
      orm_filters['route__wall__gym_id'] = filters.get('gym')

    if 'mine' in filters:
      if filters['mine'] == 'false':
        orm_filters['mine'] = False

    return orm_filters
api.register(AscentResource())

apiUrls = api.urls
