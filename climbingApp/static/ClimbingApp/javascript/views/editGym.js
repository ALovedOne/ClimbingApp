'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.views = ClimbingApp.views || {};

ClimbingApp.views.EditAscent = (function(app, baseView) {
  var controllerParams = ['$scope', '$state', '$mdDialog', 'gym', 'GymResource'];
  var controllerFn = function($scope, $state, $mdDialog, gym, GymResource) {
    baseView.call(this, controllerParams, arguments);
  };

  controllerFn.prototype = Object.create(baseView.prototype);

  controllerFn.prototype.acceptDialog = function($event) {
    this.GymResource.$save(this.gym).then(function(newGym) {
      this.$mdDialog.hide(newGym)
    }.bind(this));
  };

  controllerFn.prototype.cancelDialog = function($event) {
    this.$mdDialog.cancel(false);
  }

  var controller = controllerParams.concat([controllerFn]);
  app.controller('ClimbingAppEditGym', controller);
  return controller;
})(myApp, ClimbingApp.views.BaseModalView);