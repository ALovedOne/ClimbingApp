define(['app', 'baseView'],
function(app, baseView) {
  'use strict';

  var controllerParams = ['$scope', '$mdDialog', 'UserResource', 'OutcomeResource', 'RouteResource', 'ascent', 'route', 'wall', 'gym'];
  var controllerFn = function ClimbingApp$EditAscent$Ctrl($scope, $mdDialog, UserResource, OutcomeResource, RouteResource, ascent, route, wall, gym) 
  {
    this.$scope    = $scope;
    this.$mdDialog = $mdDialog;

    this.users =       [ascent.user];
    this.outcomes =    [ascent.outcome];
    this.route    =    [ascent.route];

    this.OutcomeResource = OutcomeResource;
    this.RouteResource = RouteResource;
    this.UserResource  = UserResource;

    this.ascent = ascent;
    this.route  = route;
    this.wall   = wall;
    this.gym    = gym;
  }; 

  controllerFn.prototype = Object.create(baseView.prototype);

  controllerFn.prototype.acceptDialog = function ClimbingApp$EditAscent$AcceptDialog($event) {
    if (this.showRouteSelection()) {
      this.ascent.route       = this.ascent.route.resource_uri;
    }

    this.ascent.user        = this.ascent.user.resource_uri;
    this.ascent.outcome     = this.ascent.outcome.resource_uri;
    
    this.ascent.date        = this.object2Date(new Date());

    this.ascent.$save().then(function(newAscent) {
      this.$mdDialog.hide(newAscent);
    }.bind(this));
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
      return this.OutcomeResource.objects.$find().then(function(outcomeList) {
        this.outcomes = outcomeList.objects;
      }.bind(this));
    }
  };

  controllerFn.prototype.loadUsers = function ClimbingApp$EditAscent$loadUsers() {
    if (this.users.length != 1) {
      return this.users;
    } else {
      return this.UserResource.objects.$find().then(function(userList) {
        this.users = userList.objects;
      }.bind(this));
    }
  };

  controllerFn.prototype.loadRoutes = function() {
    return this.RouteResource.objects.$find({
      'gym': this.gym.id,
      'active': true}).then(function(routes) {
        this.routes = routes.objects; 
      }.bind(this));
  };

  var controller = controllerParams.concat([controllerFn]);
  app.controller('ClimbingAppEditAscent', controller);
  return controller;
});
