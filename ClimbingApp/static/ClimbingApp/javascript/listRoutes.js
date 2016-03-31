define(['app'],
function(app) {
  'use strict';

  var controller = ['$scope', '$mdDialog', 'routes', 'wall', 'gym', 'GymResource', 
  function($scope, $mdDialog, routes, wall, gym, GymResource) {
    $scope.routeList = routes.objects;
    $scope.wall = wall;
    $scope.gym = gym;

    function editRoute($event, route) {
      var childScope = $scope.$new();
      return $mdDialog.show({
        templateUrl: '/static/partials/editRoute.html',
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
      editRoute($event, wall.one('routes')).then(function(newRoute) {
        $scope.routeList.push(newRoute);
      });
    }

    $scope.editRoute = function($event, route) {
      $event.cancelBubble = true;
      editRoute($event, route.clone()).then(function(newRoute) {
        var idx = _.findIndex($scope.routeList, function(route) { return route.id == newRoute.id });
        $scope.routeList[idx] = newRoute;
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
        route.remove().then(function() {
          $scope.routeList = _.without($scope.routeList, route);
        });
      });
    }

  }];

  app.controller('ClimbingAppListRoutes', controller);
  return controller;
})
