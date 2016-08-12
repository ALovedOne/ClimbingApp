define(['app', 'views/baseListView'],
function(app, baseView) {
  'use strict';

  var controllerParams = ['$scope', '$mdDialog', 'routes', 'wall', 'gym', 'RouteResource'];
  var controllerFn = function($scope, $mdDialog, routes, wall, gym, RouteResource) {
    baseView.call(this, controllerParams, arguments);

    RouteResource.$find({wall: wall.id, active: true}).then(function(routes) {
      this.routeList = routes;
    }.bind(this));
  }

  controllerFn.prototype = Object.create(baseView.prototype);

  controllerFn.prototype.editRoutePriv = function editRoute($event, route, wall, gym) {
    var childScope = this.$scope.$new();
    return this.$mdDialog.show({
      templateUrl: '/static/ClimbingApp/partials/editRoute.html',
      locals: {
        route: route,
        wall: wall,
        gym: gym
      },
      controller: 'ClimbingAppEditRoute',
      controllerAs: 'ctrl',
      targetEvent: $event,
      scope: childScope,
      onRemoving: function() {
        childScope.$destroy();
      }
    });
  }

  controllerFn.prototype.contrastColorValue = function(color) {
    var x = color.inner_r * 0.299 + color.inner_g * 0.587 + color.inner_b * 0.114;
    if (x < 186) {
      return 'white';
    } else {
      return 'black';
    }
  }

  controllerFn.prototype.addRoute = function($event) {
    $event.cancelBubble = true;
    var newRoute = this.RouteResource.$create();
    newRoute.wall = this.wall.resource_uri;

    this.editRoutePriv($event, newRoute, this.wall, this.gym).then(function(newRoute) {
      this.routeList.push(newRoute);
    }.bind(this));
  }

  controllerFn.prototype.deleteRoute = function($event, route) {
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

  var controller = controllerParams.concat([controllerFn]);
  app.controller('ClimbingAppListRoutes', controller);
  return controller;
})
