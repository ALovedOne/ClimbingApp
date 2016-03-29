from django.conf.urls import patterns, include, url

urlpatterns = (
  url('^', include('django.contrib.auth.urls')),

  url(r'^index$',         'ClimbingApp.views.home',      name="index"),
  url(r'^api/',           include('ClimbingApp.apiUrls')),
)
