define(['app'],
function(app) {
  'use strict';

  function date2Object(date) {
    if (date) {
      return new Date(date);
    } else {
      return new Date();
    }
  }

  function object2Date(dateObj) {
    if (dateObj) {
      return dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
    } else {
      return '';
    }
  }

  var controllerParams = ['$scope', '$mdDialog', 'gym', 'user', 'AscentResource'];
  var controllerFunc = function($scope, $mdDialog, gym, user, AscentResource) {
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;

    this.gym = gym;
    this.user = user;
    this.AscentResource = AscentResource;

    this.ascentList = [];
    this.filters = { gym: gym.id }

    this.loadAscents(this.filters);
  };
  controllerFunc.prototype = {
    loadAscents: function(filters) {
      this.AscentResource.objects.$find(this.filters).then(function(ascents) {
        this.ascentList = ascents.objects;
      }.bind(this));
    },

    changeFilter: function ClimbingApp$Climbing$changeFilters(filter, value) {
      if (filter == "today") {
        if (value) {
          this.filters['date'] = object2Date(new Date());
        } else {
          delete this.filters['date'];
        } 
      } else {
        this.filters[filter] = value;
      }
      this.loadAscents(this.filters);
    },
    
    addAscent: function ClimbingApp$climbing$addAscent($event) {
      $event.cancelBubble = true;

      var newAscent = this.AscentResource.objects.$create();
      newAscent.route = null;
      newAscent.user = this.user;

      this.editAscentPopUp(newAscent, $event).then(function(newAscent) {
        this.ascentList.push(newAscent);
      }.bind(this));
    },

    editAscentPopUp(ascent, $event) {
      var childScope = this.$scope.$new();
      return this.$mdDialog.show({
        templateUrl: '/static/ClimbingApp/partials/editAscent.html',
        locals: {
          ascent: ascent,
          route: null,
          wall: null,
          gym: this.gym
        },
        controller: 'ClimbingAppEditAscent',
        controllerAs: 'editAscent',
        targetEvent: $event,
        scope: childScope,
        onRemoving: function() {
          childScope.$destroy();
        }
      });
    },
  };

  var controller = controllerParams.concat([controllerFunc]);
  app.controller('ClimbingAppClimbing', controller);
  return controller;
});
