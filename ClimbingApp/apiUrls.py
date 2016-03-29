from django.conf.urls import patterns, include, url

from rest_framework_nested import routers

from .viewSets import *

router = routers.SimpleRouter()
router.register(r'gyms', GymList)

gym_router = routers.NestedSimpleRouter(router, r'gyms', lookup='gym')
gym_router.register(r'walls', GymWallList, base_name = "wall")

gym_wall_router = routers.NestedSimpleRouter(gym_router, r'walls', lookup='wall')
gym_wall_router.register(r'routes', GymWallRouteViewSet, base_name = "route")

gym_wall_route_router = routers.NestedSimpleRouter(gym_wall_router, r'routes', lookup='route')
gym_wall_route_router.register(r'ascents', GymWallRouteAscentList, base_name = "ascent")

router.register(r'walls', WallList)
router.register(r'routes', RouteList)
router.register(r'ascents', AscentList)
router.register(r'colors', ColorList)
router.register(r'difficulties', DifficultyList)
router.register(r'ascentOutcomes', AscentOutcomeList)

urlpatterns = [
  url(r'^user$', get_user),
]
urlpatterns += router.urls + gym_router.urls + gym_wall_router.urls + gym_wall_route_router.urls
