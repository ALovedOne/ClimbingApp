define(['app', 'baseView'],
function(app, baseView) {
  'use strict';

  var controllerParams = ['$scope', '$mdDialog', 'gym', 'user', 'FullGymResource', 'WallResource', 'RouteResource'];
  var controllerFunc = function($scope, $mdDialog, gym, user, FullGymResource, RouteResource) {
    baseView.call(this, controllerParams, arguments);

    this.wallList = [];

    this.loadWalls(this.filters);
  };

  controllerFunc.prototype = Object.create(baseView.prototype);

  controllerFunc.prototype.loadWalls = function(filters) {
    this.FullGymResource.$get(this.gym.id).then(function(walls) {
      this.wallList = walls;
    }.bind(this));
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
    var newRoute = this.RouteResource.objects.$create();

    this.editRoutePriv($event, newRoute, wall).then(function(savedRoute) {
      wall.routeList.push(savedRoute); 
    }.bind(this));
  }

  controllerFunc.prototype.removeRoute = function($event, route) {
    var newRoute = this.RouteResource.objects.$create(route);

    var confirm = this.$mdDialog.confirm()
      .title("Take down this route?")
      .targetEvent($event)
      .ok("Remove")
      .cancel("Don't do it");

    this.$mdDialog.show(confirm).then(function() {
      newRoute.removeDate = this.object2Date(new Date());
      newRoute.$save().then(function(newRoute) {
        this.removeRoutePriv(newRoute);
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
      return wall.resource_uri == route.wall;
    });
    wall.routeList = wall.routeList.filter(function(r) {
      return r.resource_uri != route.resource_uri;
    });
    console.log(wall);
  }

  var controller = controllerParams.concat([controllerFunc]);
  app.controller('ClimbingAppFullGym', controller);
  return controller;
});
