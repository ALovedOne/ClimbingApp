define(['app'],
function(app) {
  'use strict';

  var controller = ['$scope', '$state', '$mdDialog', 'GymResource', 'DifficultyResource', 'ColorResource', 'gym', 'wall', 'route',
  function($scope, $state, $mdDialog, GymResource, DifficultyResource, ColorResource, gym, wall, route) {
    $scope.route = route;
    $scope.setDateObj =    date2Object(route.setDate, true);
    $scope.removeDateObj = date2Object(route.removeDate);

    if (route.difficulty) {
      $scope.difficulties = [route.difficulty];
    }
    if (route.color) {
      $scope.colors =       [route.color];
    }
    
    function date2Object(date, defaultToday) {
      if (date) {
        return new Date(date);
      } else if (defaultToday) {
        return new Date();
      } else {
        return null;
      }
    }

    function obj2Date(date) {
      if (date == null) {
        return null;
      } else {
        return date.toISOString().split("T")[0];
      }
    }

    $scope.acceptDialog = function($event) {
      route.wall       = wall.resource_uri;
      route.color      = $scope.route.color.resource_uri;
      route.difficulty = $scope.route.difficulty.resource_uri;
      route.setDate    = obj2Date($scope.setDateObj);
      route.removeDate = obj2Date($scope.removeDateObj);
      
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
      if ($scope.difficulties && $scope.difficulties.length != 1) {
        return $scope.difficulties;
      } else {
       return DifficultyResource.objects.$find().then(function(difficultyList) {
          $scope.difficulties = difficultyList.objects;
        });
      }
    }

    $scope.loadColors = function() {
      if ($scope.colors && $scope.colors.length != 1) {
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
