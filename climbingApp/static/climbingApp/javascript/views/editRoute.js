'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.views = ClimbingApp.views || {};

ClimbingApp.views.EditAscent = (function(app, baseView) {

  var controllerParams = ['$scope', '$state', '$mdDialog', 'GymResource', 'RouteResource', 'DifficultyResource', 'ColorResource', 'gym', 'wall', 'route'];
  var controllerFn = function() {

    if (this.route.difficulty) {
      this.difficulties = [this.route.difficulty];
    }

    if (this.route.color) {
      this.colors =       [this.route.color];
    }
  };
  controllerFn.prototype = Object.create(baseView.prototype);

    
  controllerFn.prototype.acceptDialog = function($event) {
    this.route.wall       = this.wall;

    this.RouteResource.$save(this.route).then(function(newRoute) {
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
     return this.DifficultyResource.$find().then(function(difficultyList) {
        this.difficulties = difficultyList;
      }.bind(this));
    }
  }

  controllerFn.prototype.loadColors = function() {
    if (this.colors && this.colors.length != 1) {
      return this.colors;
    } else {
      return this.ColorResource.$find().then(function(colorList) {
        this.colors = colorList;
      }.bind(this));
    }
  }

  controllerFn.prototype.hexValue = function editRoute$hexValue(color) {
    return 'rgb(' + color.inner_r + ',' + color.inner_g + ',' + color.inner_b + ')';
  }

  controllerFn.$inject = controllerParams;
  var controller = ClimbingApp.utils.extendClass(controllerFn, baseView);
  app.controller('ClimbingAppEditRoute', controller);
  return controller;

})(myApp, ClimbingApp.views.BaseModalView);
