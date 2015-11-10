from django.conf.urls import patterns, include, url

urlpatterns = patterns('', 
  url(r'wall/([0-9])/', 'ClimbingApp.views.viewWall'), 
  url(r'^/index', 'ClimbingApp.views.home', name="home"),
)
