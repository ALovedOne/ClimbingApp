define(['app', 'baseView'],
function(app, baseView) {
  'use strict';

  var controllerParams = ['$scope', '$state', '$mdDialog', 'GymResource', 'DifficultyResource', 'ColorResource', 'gym', 'wall', 'route'];
  var controllerFn = function($scope, $state, $mdDialog, GymResource, DifficultyResource, ColorResource, gym, wall, route) {
    baseView.call(this);

    this.$scope    = $scope;
    this.$mdDialog = $mdDialog;

    this.DifficultyResource = DifficultyResource;
    this.ColorResource = ColorResource;

    this.gym   = gym;
    this.wall  = wall;
    this.route = route;

    this.setDateObj =    this.date2Object(route.setDate, true);
    this.removeDateObj = this.date2Object(route.removeDate);

    if (route.difficulty) {
      this.difficulties = [route.difficulty];
    }

    if (route.color) {
      this.colors =       [route.color];
    }
  };
  controllerFn.prototype = Object.create(baseView.prototype);

    
  controllerFn.prototype.acceptDialog = function($event) {
    this.route.wall       = this.wall.resource_uri;
    this.route.color      = this.route.color.resource_uri;
    this.route.difficulty = this.route.difficulty.resource_uri;
    this.route.setDate    = this.object2Date(this.setDateObj);
    this.route.removeDate = this.object2Date(this.removeDateObj);
    
    this.route.$save().then(function(newRoute) {
      newRoute.color = this.route.color;
      newRoute.difficulty = this.route.difficulty;
      this.$mdDialog.hide(newRoute);
    }.bind(this));
  }

  controllerFn.prototype.cancelDialog = function($event) {
    this.$mdDialog.cancel(false);
  }

  controllerFn.prototype.loadDifficulties = function() {
    if (this.difficulties && this.difficulties.length != 1) {
      return this.difficulties;
    } else {
     return this.DifficultyResource.objects.$find().then(function(difficultyList) {
        this.difficulties = difficultyList.objects;
      }.bind(this));
    }
  }

  controllerFn.prototype.loadColors = function() {
    if (this.colors && this.colors.length != 1) {
      return this.colors;
    } else {
      return this.ColorResource.objects.$find().then(function(colorList) {
        this.colors = colorList.objects;
      }.bind(this));
    }
  }

  controllerFn.prototype.hexValue = function editRoute$hexValue(color) {
    return 'rgb(' + color.inner_r + ',' + color.inner_g + ',' + color.inner_b + ')';
  }

  var controller = controllerParams.concat([controllerFn]);
  app.controller('ClimbingAppEditRoute', controller);
  return controller;
});
