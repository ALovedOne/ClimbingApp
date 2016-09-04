define(['angular', 'app', 'views/baseView'],
function(angular, app, baseView) {
  'use strict';

  var controllerParams = ['$scope', '$mdDialog', 'gym', 'user', 'WallResource', 'RouteResource'];
  var controllerFunc = function($scope, $mdDialog, gym, user, WallResource, RouteResource) {
    baseView.call(this, controllerParams, arguments);

    this.wallList = [];

    this.load(this.filters);
  };

  controllerFunc.prototype = angular.extend({}, baseView.prototype);

  controllerFunc.prototype.load = function(filters) {
    var wallsPromise = this.WallResource.$findAll({ gym: this.gym.id });
    var routesPromise = this.RouteResource.$findAll({ gym: this.gym.id, active: true });
    wallsPromise.then(function(walls) {
      routesPromise.then(function(routes) {
        this.wallList = walls.map(function(wall) {
          wall.routeList = routes.filter(function(route) {
            return route.wall_uri == wall.resource_uri;
          }.bind(this));
          return wall;
        }.bind(this));
      }.bind(this));
    }.bind(this))
  };

  controllerFunc.prototype.contrastColorValue = function(color) {
    var x = color.inner_r * 0.299 + color.inner_g * 0.587 + color.inner_b * 0.114;
    if (x < 186) {
      return 'white';
    } else {
      return 'black';
    }
  }

  controllerFunc.prototype.addRoute = function($event, wall) {
    var newRoute = this.RouteResource.$create();

    this.editRoutePriv($event, newRoute, wall).then(function(savedRoute) {
      wall.routeList.push(savedRoute); 
    }.bind(this));
  }

  controllerFunc.prototype.removeRoute = function($event, route) {

    var confirm = this.$mdDialog.confirm()
      .title("Take down this route?")
      .targetEvent($event)
      .ok("Remove")
      .cancel("Don't do it");

    this.$mdDialog.show(confirm).then(function() {
      route.removeDate = new Date();
      this.RouteResource.$save(route).then(function(route2) {
        this.removeRoutePriv(route2);
      }.bind(this));
    }.bind(this));
  }

  controllerFunc.prototype.editRoutePriv = function ClimbingApp$FullGym$EditRoutePriv($event, route, wall, gym) {
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

  controllerFunc.prototype.removeRoutePriv = function ClimbingApp$FullGym$RemoveRoutePriv(route) {
    var wall = this.wallList.find(function(wall) {
      return wall.resource_uri == route.wall_uri;
    });
    wall.routeList = wall.routeList.filter(function(r) {
      return r.resource_uri != route.resource_uri;
    });
  }

  var controller = controllerParams.concat([controllerFunc]);
  app.controller('ClimbingAppFullGym', controller);
  return controller;
});
