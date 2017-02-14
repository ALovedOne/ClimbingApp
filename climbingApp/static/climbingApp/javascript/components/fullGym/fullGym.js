'use strict';
(function(baseView) {

  var fullGymCtrl = function() {
    this.wallList = [];

    this.load(this.filters);
  };
  fullGymCtrl.$inject = ['$scope', '$mdDialog', 'WallResource', 'RouteResource'];

  fullGymCtrl.prototype = {};

  fullGymCtrl.prototype.load = function(filters) {
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

  fullGymCtrl.prototype.contrastColorValue = function(color) {
    var x = color.inner_r * 0.299 + color.inner_g * 0.587 + color.inner_b * 0.114;
    if (x < 186) {
      return 'white';
    } else {
      return 'black';
    }
  }

  fullGymCtrl.prototype.addRoute = function($event, wall) {
    var newRoute = this.RouteResource.$create();
    newRoute.setDate = new Date();

    this.editRoutePriv($event, newRoute, wall, this.gym).then(function(savedRoute) {
      wall.routeList.push(savedRoute); 
    }.bind(this));
  }

  fullGymCtrl.prototype.removeRoute = function($event, route) {

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

  fullGymCtrl.prototype.editRoutePriv = function ClimbingApp$FullGym$EditRoutePriv($event, route, wall, gym) {
    return this.$mdDialog.show({
      templateUrl: '/static/climbingApp/partials/editRoute.html',
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

  fullGymCtrl.prototype.removeRoutePriv = function ClimbingApp$FullGym$RemoveRoutePriv(route) {
    var wall = this.wallList.find(function(wall) {
      return wall.resource_uri == route.wall_uri;
    });
    wall.routeList = wall.routeList.filter(function(r) {
      return r.resource_uri != route.resource_uri;
    });
  }

  angular.module('ClimbingApp').component('fullGym', {
    templateUrl: '/static/climbingApp/javascript/components/fullGym/fullGym.html',
    controller: ClimbingApp.utils.extendClass(fullGymCtrl, baseView),
    bindings: {
      gym: '<',
      user: '<',
    },
  });
})(ClimbingApp.views.BaseListView);
