define(['app'],
function(app) {
  'use strict';

  var controllerFn = function ClimbingApp$EditAscent$Ctrl($scope, $mdDialog, UserResource, OutcomeResource, RouteResource, ascent, route, wall, gym) {
    $scope.users =       [ascent.user];
    $scope.outcomes =    [ascent.outcome];

    this.RouteResource = RouteResource;

    this.ascent = ascent;
    this.route  = route;
    this.wall   = wall;
    this.gym    = gym;

    function date2Object(date) {
      if (date) {
        return new Date(date);
      } else {
        return new Date();
      }
    }

    $scope.ascent = ascent;

    $scope.acceptDialog = function($event) {
      ascent.route       = route.resource_uri;
      ascent.user        = $scope.ascent.user.resource_uri;
      ascent.outcome     = $scope.ascent.outcome.resource_uri;

      ascent.date        = new Date().toISOString().split("T")[0];

      ascent.$save().then(function(newAscent) {
        $mdDialog.hide(newAscent);
      });
    }

    $scope.cancelDialog = function($event) {
      $mdDialog.cancel(false);
    }

    $scope.loadUsers = function editAscents$loadUsers() {
      if ($scope.users.length != 1) {
        return $scope.users;
      } else {
        return UserResource.objects.$find().then(function(userList) {
          $scope.users = userList.objects;
        });
      }
    };

    $scope.loadOutcomes = function editAscent$loadOutcomes() {
      if ($scope.outcomes.length != 1) {
        return $scope.outcomes;
      } else {
        return OutcomeResource.objects.$find().then(function(outcomeList) {
          $scope.outcomes = outcomeList.objects;
        });
      }
    }
  }; 
  controllerFn.prototype = {
    allowPickRoute: function() {
      return route == null;
    },

    loadRoutes: function() {
      return this.RouteResource.objects.$find({
        'gym': this.gym.id});
    },
  };

  var controller = ['$scope', '$mdDialog', 'UserResource', 'OutcomeResource', 'RouteResource', 'ascent', 'route', 'wall', 'gym', controllerFn];

  app.controller('ClimbingAppEditAscent', controller);
  return controller;
});
