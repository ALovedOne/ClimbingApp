define(['app', 'baseModalView'],
function(app, baseView) {
  'use strict';

  var controllerParams = ['$scope', '$state', '$mdDialog', 'GymResource', 'gym', 'wall'];
  var controllerFn = function($scope, $state, $mdDialog, GymResource, gym, wall) {
    baseView.call(this, controllerParams, arguments);
  };

  controllerFn.prototype = Object.create(baseView);

  controllerFn.prototype.acceptDialog = function($event) {
    this.wall.$save().then(function(newWall) {
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

  var controller = controllerParams.concat([controllerFn]);
  app.controller('ClimbingAppEditWall', controller);
  return controller;
});
