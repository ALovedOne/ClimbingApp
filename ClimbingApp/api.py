from tastypie import fields
from tastypie.api import Api
from tastypie.authentication import Authentication, ApiKeyAuthentication, MultiAuthentication, BasicAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.exceptions import NotFound
from tastypie.http import HttpUnauthorized, HttpForbidden
from tastypie.models import create_api_key, ApiKey
from tastypie.resources import ModelResource
from tastypie.utils import trailing_slash

from django.conf.urls import url, include
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import signals

from .models import *

api = Api(api_name = 'v1')

class LoginCanEditAuth(Authorization):
  def read_list(self, obj_list, bundle):
    return obj_list

  def read_detail(self, obj_list, bundle):
    return True

  def create_list(self, obj_list, bundle):
    return obj_list

  def create_detail(self, obj_list, bundle):
    return bundle.obj.user.isAuthenticated()

  def update_list(self, obj_list, bundle):
    return obj_list

  def update_detail(self, obj_list, bundle):
    return bundle.obj.user.isAuthenticated()

  def delete_list(self, obj_list, bundle):
    return obj_list

  def delete_detail(self, obj_list, bundle):
    return bundle.obj.user.isAuthenticated()
    
class TokenAuthentication(Authentication):
  def _unauthorized(self):
    return HttpUnauthorized()

  def is_authenticated(self, request, **kwargs):
    try:
      token = request.META.get('HTTP_AUTHORIZATION').split(" ")[1]
      user = User.objects.get(api_key__key = token)
      request.user = user
      
    except Exception as e:
      request.user = AnonymousUser
    
    return True

  def get_identifier(self, request):
    return "HI"

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

  def login(self, request, **kwargs):
    self.method_check(request, allowed = ['post'])

    data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))

    username = data.get('username', '')
    password = data.get('password', '')

    user = authenticate(username=username, password=password)
    if user:
      apiKey = self.get_or_create_apikey(user)
      return self.create_response(request , {
        'success': True,
        'apiKey': apiKey.key,
        'username': user.username,
      })
    return self.create_response(request, {
      'success': False
    }, HttpUnauthorized)


  def get_or_create_apikey(self, userInstance):
    key = ApiKey.objects.get(user = userInstance)
    if key:
      return key
    else:
      return ApiKey.objects.create(user = userInstance)

  def prepend_urls(self):
    return [
      url(r"^(?P<resource_name>%s)/login/$" % self._meta.resource_name, self.wrap_view('login')),
    ]
api.register(UserResource())


signals.post_save.connect(create_api_key, sender=User)

# Utility resources
class ColorResource(ModelResource):
  class Meta:
    queryset = Color.objects.all()
    resource_name = "colors"
    authentication = ApiKeyAuthentication()
    authorization = Authorization()
    #authentication = TokenAuthentication()
    #authorization = LoginCanEditAuth()
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
    queryset = Gym.objects.all().order_by('sort_name')
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
    queryset = Wall.objects.all().order_by('sort_name')
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
      'user': 'exact',
      'route': 'exact',
      'outcome': ALL, 
      'date': ALL
    }
  route = fields.ForeignKey(RouteResource, 'route')
  outcome = fields.ForeignKey(AscentOutcomeResource, 'outcome', full = True)
  user = fields.ForeignKey(UserResource, 'user')
api.register(AscentResource())


apiUrls = api.urls
