define(['app', 'baseView'],
function(app, baseView) {
  'use strict';

  var controllerParams = ['$scope', '$mdDialog', 'gym', 'user', 'FullGymResource', 'RouteResource2'];
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


  }

  controllerFunc.prototype.removeRoute = function($event, route) {

  }

  var controller = controllerParams.concat([controllerFunc]);
  app.controller('ClimbingAppFullGym', controller);
  return controller;
});
