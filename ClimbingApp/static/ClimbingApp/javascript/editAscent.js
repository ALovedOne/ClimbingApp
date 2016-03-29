define(['app'],
function(app) {
  'use strict';
  
  var controller = ['$scope', '$mdDialog', 'UserResource', 'ascent', 'route', 'wall', 'gym',
  function($scope, $mdDialog, UserResource, ascent, route, wall, gym) {
    $scope.users =       [ascent.user];
    
    function date2Object(date) {
      if (date) {
        return new Date(date);
      } else {
        return new Date();
      }
    }

    $scope.ascent = ascent;

    $scope.acceptDialog = function($event) {
      ascent.routeId     = route.id;
      ascent.userId      = -1; // Gets replaced on server
      ascent.date        = new Date().toISOString().split("T")[0];
      ascent.outcome_id  = 1;
      
      ascent.save().then(function(newAscent) {
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
        return UserResource.getList().then(function(userList) {
          $scope.users = userList;
        });
      }
    };
  }];
  
  app.controller('ClimbingAppEditAscent', controller);
  return controller;
});
