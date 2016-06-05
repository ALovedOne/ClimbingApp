import datetime

from tastypie import fields
from tastypie.api import Api
from tastypie.authentication import Authentication, ApiKeyAuthentication, MultiAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.exceptions import *
from tastypie import http 
from tastypie.models import create_api_key, ApiKey
from tastypie.resources import ModelResource, Resource
from tastypie.utils import trailing_slash

from django.conf.urls import url, include
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import signals, Count, Q

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
    
class UserResource(ModelResource):
  class Meta:
    queryset = User.objects.all()
    resource_name = "users"
    #authentication = ApiKeyAuthentication()
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
    authorization = Authorization()
    always_return_data = True
    excludes = ['email', 'password', 'is_superuser']

  def obj_get(self, bundle, **kwargs):
    if kwargs['pk'] != 'me':
      return super(ModelResource, self).obj_get(bundle, **kwargs)
    if not bundle.request.user.is_authenticated():
      raise ImmediateHttpResponse(response = http.HttpUnauthorized("User not logged in"))
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
    }, http.HttpUnauthorized)


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
    queryset = Color.objects.all().order_by('name')
    resource_name = "colors"
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
    authorization = Authorization()
    always_return_data = True
api.register(ColorResource())

class DifficultyResource(ModelResource):
  class Meta:
    queryset = Difficulty.objects.all()
    resource_name = "difficulties"
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
    authorization = Authorization()
    always_return_data = True
api.register(DifficultyResource())

class AscentOutcomeResource(ModelResource):
  class Meta:
    queryset = AscentOutcome.objects.all()
    resource_name = "ascent_outcomes"
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
    authorization = Authorization()
    always_return_data = True
api.register(AscentOutcomeResource())

class GymResource(ModelResource):
  class Meta:
    queryset = Gym.objects.all().order_by('sort_name')
    resource_name = "gyms"
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
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
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
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
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
    authorization = Authorization()
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
    active = True

    if 'active' in filters:
      active = filters.pop('active')

    qs = super(RouteResource, self).apply_filters(request, filters, **kwargs)

    if active: 
      today = datetime.date.today()
      qs = qs.filter(Q(removeDate__gt = today) | Q(removeDate = None))

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

    return orm_filters

api.register(RouteResource())

class AscentResource(ModelResource):
  class Meta:
    queryset = Ascent.objects.all()
    resource_name = "ascents"
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
    authorization = Authorization()
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

class StatObject:
  def __init__(self, gym, stats):
    self.pk = gym.id 
    self.gym = gym
    self.data = []

    inDict = {}

    for x in stats:
      outcome = x['outcome']
      if not outcome in inDict:
        inDict[outcome] = len(self.data)
        self.data.append({
          "key": outcome,
          "values": []
        })
      self.data[inDict[outcome]]["values"].append(x)

    test = map(lambda array: set(map(lambda v: v['date'], array['values'])), self.data)
    test = list(test)
    
    for testArrayA in test:
      for testArrayB in test:
        print(testArrayA - testArrayB)

class UserAscentStatisticsResource(Resource):
  gym  = fields.ForeignKey(GymResource, 'gym')
  data = fields.DictField()
  class Meta:
    resource_name = 'ascent_summary'
    authentication = MultiAuthentication(ApiKeyAuthentication(), Authentication())
    allowed_methods = ['get']

  def obj_get(self, bundle, **kwargs):
    gym  = Gym.objects.get(id = kwargs['pk'])
    data = Ascent.objects.filter(user = bundle.request.user, route__wall__gym = gym).values('date', 'user', 'outcome', 'route__difficulty').annotate(Count("id"))
    return StatObject(gym, data)

  def dehydrate_data(self, bundle):
    return bundle.obj.data 
api.register(UserAscentStatisticsResource())

apiUrls = api.urls
