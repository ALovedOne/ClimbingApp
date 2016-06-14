define(['app', 'baseView'],
function(app, baseView) {
  'use strict';

  var controllerParams = ['$scope', '$state', '$mdDialog', 'gym'];
  var controllerFn = function($scope, $state, $mdDialog, gym) {
    baseView.call(this);

    this.$mdDialog = $mdDialog;

    this.gym = gym;
  };

  controllerFn.prototype = Object.create(baseView.prototype);

  controllerFn.prototype.acceptDialog = function($event) {
    this.gym.$save().then(function(newGym) {
      this.$mdDialog.hide(newGym)
    }.bind(this));
  };

  controllerFn.prototype.cancelDialog = function($event) {
    this.$mdDialog.cancel(false);
  }

  var controller = controllerParams.concat([controllerFn]);
  app.controller('ClimbingAppEditGym', controller);
  return controller;
});
