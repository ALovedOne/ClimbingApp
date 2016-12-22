'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.views = ClimbingApp.views || {};

ClimbingApp.views.ListGym = (function(app, baseView) {
  var controllerParams = ['$scope', '$mdDialog', 'routes', 'wall', 'gym', 'RouteResource'];
  var controllerFn = function() {

    RouteResource.$find({wall: this.wall.id, active: true}).then(function(routes) {
      this.routeList = routes;
    }.bind(this));
  }

  controllerFn.prototype = Object.create(baseView.prototype);

  controllerFn.prototype.editRoutePriv = function editRoute($event, route, wall, gym) {
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

  controllerFn.$inject = controllerParams;
  var controller = ClimbingApp.utils.extendCtrl(controllerFn, baseView);
  app.controller('ClimbingAppListRoutes', controller);
  return controller;
})(myApp, ClimbingApp.views.BaseListView);
