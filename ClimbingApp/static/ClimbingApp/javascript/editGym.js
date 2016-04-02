define(['app'],
function(app) {
  'use strict';

  var controller = ['$scope', '$state', '$mdDialog', 'GymResource', 'gym', 
  function($scope, $state, $mdDialog, GymResource, gym) {
    $scope.gym = gym;

    $scope.acceptDialog = function($event) {
      gym.$save().then(function(newGym) {
        $mdDialog.hide(newGym)
      });
    }
 
    $scope.cancelDialog = function($event) {
      $mdDialog.cancel(false);
    }

  }];
    
  app.controller('ClimbingAppEditGym', controller);
  return controller;
});
