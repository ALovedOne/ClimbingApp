'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.views = ClimbingApp.views || {};

ClimbingApp.views.EditAscent = (function(baseView) {

  var controllerParams = ['$scope', '$mdDialog', 'UserResource', 'OutcomeResource', 'RouteResource', 'AscentResource', 'ascent', 'route', 'wall', 'gym'];
  var controllerFn = function ClimbingApp$EditAscent$Ctrl() {

    this.users =       [this.ascent.user];
    this.outcomes =    [this.ascent.outcome];
    this.route    =    [this.ascent.route];
  }; 
  controllerFn.prototype = Object.create(baseView.prototype);

  controllerFn.prototype.acceptDialog = function ClimbingApp$EditAscent$AcceptDialog($event) {
    if (this.showRouteSelection()) {
      this.ascent.route       = this.ascent.route.resource_uri;
    }

    if (this.ascent.user && this.ascent.outcome) {
      this.ascent.date        = new Date();
     
      this.AscentResource.$save(this.ascent).then(function(newAscent) {
        this.$mdDialog.hide(newAscent);
      }.bind(this));
    }
  };

  controllerFn.prototype.cancelDialog = function ClimbingApp$EditAscent$CancelDialog($event) {
    this.$mdDialog.cancel(false);
  };

  controllerFn.prototype.showRouteSelection = function() {
    return this.route == null;
  };

  controllerFn.prototype.loadOutcomes = function ClimbingApp$EditAscent$loadOutcomes() {
    if (this.outcomes.length != 1) {
      return this.outcomes;
    } else {
      return this.OutcomeResource.$find().then(function(outcomeList) {
        this.outcomes = outcomeList;
      }.bind(this));
    }
  };

  controllerFn.prototype.loadUsers = function ClimbingApp$EditAscent$loadUsers() {
    if (this.users.length != 1) {
      return this.users;
    } else {
      return this.UserResource.$find().then(function(userList) {
        this.users = userList;
      }.bind(this));
    }
  };

  controllerFn.prototype.loadRoutes = function() {
    return this.RouteResource.$find({
      'gym': this.gym.id,
      'active': true}).then(function(routes) {
        this.routes = routes; 
      }.bind(this));
  };

  controllerFn.$inject = controllerParams;
  var controller = ClimbingApp.utils.extendCtrl(controllerFn, baseView);
  myApp.controller('ClimbingAppEditAscent', controller);
  return controller;
})(ClimbingApp.views.BaseModalView);
