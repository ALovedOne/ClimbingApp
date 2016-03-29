define(['app'],
function(app) {
  'use strict';

  var controller = ['$scope', '$state', '$mdDialog', 'GymResource', 'DifficultyResource', 'ColorResource', 'gym', 'wall', 'route',
  function($scope, $state, $mdDialog, GymResource, DifficultyResource, ColorResource, gym, wall, route) {
    $scope.route = route;
    $scope.setDateObj =    date2Object(route.setDate);
    $scope.removeDateObj = date2Object(route.removeDate);

    $scope.difficulties = [route.difficulty];
    $scope.colors =       [route.color];
    
    
    function date2Object(date) {
      if (date) {
        return new Date(date);
      } else {
        return new Date();
      }
    }


    $scope.acceptDialog = function($event) {
      route.name         = "Some Name";
      route.wallId       = wall.id;
      route.colorId      = $scope.route.color.id;
      route.difficultyId = $scope.route.difficulty.id;
      route.setDate      = $scope.setDateObj.toISOString().split("T")[0];
      route.removeDate   = $scope.removeDateObj.toISOString().split("T")[0];
      
      route.save().then(function(newRoute) {
        newRoute.color = $scope.route.color;
        newRoute.difficulty = $scope.route.difficulty;
        $mdDialog.hide(newRoute);
      });
    }

    $scope.cancelDialog = function($event) {
      $mdDialog.cancel(false);
    }

    $scope.loadDifficulties = function() {
      if ($scope.difficulties.length != 1) {
        return $scope.difficulties;
      } else {
       return DifficultyResource.getList().then(function(difficultyList) {
          $scope.difficulties = difficultyList;
        });
      }
    }

    $scope.loadColors = function() {
      if ($scope.colors.length != 1) {
        return $scope.colors;
      } else {
        return ColorResource.getList().then(function(colorList) {
          $scope.colors = colorList;
        });
      }
    }

  }];
    
  app.controller('ClimbingAppEditRoute', controller);
  return controller;
});
