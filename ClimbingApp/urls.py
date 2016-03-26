from django.conf.urls import patterns, include, url

urlpatterns = (
#  url('^', include('django.contrib.auth.urls')),

#  url(r'gym/([0-9])/$',   'ClimbingApp.views.viewGym',   name="viewGym"),
#  url(r'gym/([0-9])/addWall$',
#                         'ClimbingApp.views.addWall',   name="addWall"),
#  url(r'wall/([0-9])/$',  'ClimbingApp.views.viewWall',  name="viewWall"), 
#  url(r'route/([0-9])/$', 'ClimbingApp.views.viewRoute', name='viewRoute'),
#  url(r'^index$',         'ClimbingApp.views.home',      name="index"),
  url(r'^api/',           include('ClimbingApp.apiUrls')),
)
