'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.views = ClimbingApp.views || {};

ClimbingApp.views.EditAscent = (function(app, baseView) {
  var controllerParams = ['$scope', '$state', '$mdDialog', 'gym', 'GymResource'];
  var controllerFn = function() {
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

  controllerFn.$inject = controllerParams;
  var controller = ClimbingApp.utils.extendCtrl(controllerFn, baseView);
  app.controller('ClimbingAppEditGym', controller);
  return controller;
})(myApp, ClimbingApp.views.BaseModalView);
