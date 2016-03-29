from django.conf.urls import patterns, include, url

from .api import apiUrls
from .views import *

urlpatterns = (
  url('^', include('django.contrib.auth.urls')),
  url(r'^index$', home, name="index"),
  url(r'^api/',   include(apiUrls)),
)
