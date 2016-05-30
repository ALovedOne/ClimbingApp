define(['app'], function(app) {
  'use strict';

  app.value('AnonymousUser', {
    name: "Anonymous"
  });
  
  function addColorToHex(color) {
    color.hexValue = function() {
      return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    };

    color.contrastColorHexValue = function() {
      var r = this.r * 0.299;
      var g = this.g * 0.587;
      var b = this.b * 0.114;
            
      return (r + g + b) > 104? "black": "white";
    };
  }

  app.config(['$tastypieProvider', function($tastypieProvider) {
    $tastypieProvider.setResourceUrl('/api/v1/');
    //$tastypieProvider.setAuth('ALovedOne', '0ad8fc2eca980937a55a1e3f41baff012b37539e');
  }]);
  
  app.factory(
    'GymResource', ['$tastypieResource', function($tastypieResource) {
      return new $tastypieResource('gyms');
  }]);
  app.factory(
    'WallResource', ['$tastypieResource', function($tastypieResource) {
      return new $tastypieResource('walls');
  }]);
  app.factory(
    'RouteResource', ['$tastypieResource', function($tastypieResource) {
      return new $tastypieResource('routes');
  }]);
  app.factory(
    'AscentResource', ['$tastypieResource', function($tastypieResource) {
      return new $tastypieResource('ascents');
  }]);
  app.factory(
    'ColorResource', ['$tastypieResource', function($tastypieResource) {
      return new $tastypieResource('colors');
  }]);
  app.factory(
    'DifficultyResource', ['$tastypieResource', function($tastypieResource) {
      return new $tastypieResource('difficulties');
  }]);
  app.factory(
    'OutcomeResource', ['$tastypieResource', function($tastypieResource) {
      return new $tastypieResource('ascent_outcomes');
  }]);
  app.factory(
    'UserResource', ['$tastypieResource', function($tastypieResource) {
      return new $tastypieResource('users');
  }]);
  app.factory(
    'UserGymStatsResource', ['$tastypieResource', function($tastypieResource) {
      return new $tastypieResource('ascent_summary');
  }]);
});
