'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.views = ClimbingApp.views || {};

ClimbingApp.views.EditAscent = (function(app, baseView) {

  var controllerParams = ['$scope', '$state', '$mdDialog', 'GymResource', 'WallResource', 'gym', 'wall'];
  var controllerFn = function() {
  };

  controllerFn.prototype = Object.create(baseView);

  controllerFn.prototype.acceptDialog = function($event) {
    this.WallResource.$save(this.wall).then(function(newWall) {
      this.$mdDialog.hide(newWall)
    }.bind(this));
  }

  controllerFn.prototype.cancelDialog = function($event) {
    this.$mdDialog.cancel(false);
  }

  controllerFn.prototype.loadGyms = function() {
    this.gyms = this.GymResource.query();
    return $scope.gyms;
  }

  controllerFn.$inject = controllerParams;
  var controller = ClimbingApp.utils.extendClass(controllerFn, baseView);
  app.controller('ClimbingAppEditWall', controller);
  return controller;
})(myApp, ClimbingApp.views.BaseModalView);
