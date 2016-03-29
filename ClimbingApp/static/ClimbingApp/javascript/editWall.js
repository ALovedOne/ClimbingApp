define(['app'],
function(app) {
  'use strict';

  var controller = ['$scope', '$state', '$mdDialog', 'GymResource', 'gym', 'wall', 
  function($scope, $state, $mdDialog, GymResource, gym, wall) {
    $scope.wall = wall;

    $scope.acceptDialog = function($event) {
      wall.save().then(function(newWall) {
        $mdDialog.hide(newWall)
      });
    }
 
    $scope.cancelDialog = function($event) {
      $mdDialog.cancel(false);
    }
    
    $scope.loadGyms = function() {
      $scope.gyms = GymResource.query();
      return $scope.gyms;
    }
  }];
    
  app.controller('ClimbingAppEditWall', controller);
  return controller;
});
