define(['app'],
function(app) {
  'use strict';

  var controller = ['$scope', '$mdDialog', 'routes', 'wall', 'gym', 'RouteResource', 
  function($scope, $mdDialog, routes, wall, gym, RouteResource) {
    $scope.routeList = routes.objects;
    $scope.wall = wall;
    $scope.gym = gym;

    function editRoute($event, route) {
      var childScope = $scope.$new();
      return $mdDialog.show({
        templateUrl: '/static/ClimbingApp/partials/editRoute.html',
        locals: {
          route: route,
          wall: wall,
          gym: gym
        },
        controller: 'ClimbingAppEditRoute',
        targetEvent: $event,
        scope: childScope,
        onRemoving: function() {
          childScope.$destroy();
        }
      });
    }

    $scope.addRoute = function($event) {
      $event.cancelBubble = true;
      var newRoute = RouteResource.objects.$create();
      newRoute.wall = wall.resource_uri;

      editRoute($event, newRoute).then(function(newRoute) {
        $scope.routeList.push(newRoute);
      });
    }

    $scope.deleteRoute = function($event, route) {
      $event.cancelBubble = true;
      var confirm = $mdDialog.confirm()
        .title("Delete this Route?")
        .targetEvent($event)
        .ok("Delete Route")
        .cancel("Don't do it");

      $mdDialog.show(confirm).then(function() {
        route.$delete().then(function() {
          $scope.routeList = _.without($scope.routeList, route);
        });
      });
    }

  }];

  app.controller('ClimbingAppListRoutes', controller);
  return controller;
})
