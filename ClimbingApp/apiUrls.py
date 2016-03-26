from django.conf.urls import patterns, include, url

from .views import GymList

urlpatterns = (
  url('^gyms/', GymList.as_view()), 
)
