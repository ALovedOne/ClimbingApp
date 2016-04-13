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
      route.name       = "Some Name";
      route.wall       = wall.resource_uri;
      route.color      = $scope.route.color.resource_uri;
      route.difficulty = $scope.route.difficulty.resource_uri;
      route.setDate    = $scope.setDateObj.toISOString().split("T")[0];
      route.removeDate = $scope.removeDateObj.toISOString().split("T")[0];
      
      route.$save().then(function(newRoute) {
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
       return DifficultyResource.objects.$find().then(function(difficultyList) {
          $scope.difficulties = difficultyList.objects;
        });
      }
    }

    $scope.loadColors = function() {
      if ($scope.colors.length != 1) {
        return $scope.colors;
      } else {
        return ColorResource.objects.$find().then(function(colorList) {
          $scope.colors = colorList.objects;
        });
      }
    }

    $scope.hexValue = function editRoute$hexValue(color) {
      return 'rgb(' + color.inner_r + ',' + color.inner_g + ',' + color.inner_b + ')';
    }
  }];

  app.controller('ClimbingAppEditRoute', controller);
  return controller;
});
