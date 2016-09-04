define(['app', 'views/baseView', 'utils'],
function(app, baseView, utils) {
  'use strict';

  var controllerParams = ['$scope', '$mdDialog', 'gym', 'user', 'AscentResource'];
  var controllerFunc = function($scope, $mdDialog, gym, user, AscentResource) {
    baseView.call(this, controllerParams, arguments);

    this.ascentList = [];

    this.filters = { gym: gym.id }
    this.loadAscents(this.filters);
  };

  controllerFunc.prototype = Object.create(baseView.prototype);

  controllerFunc.prototype.loadAscents = function(filters) {
    this.AscentResource.$find(this.filters).then(function(ascents) {
      this.ascentList = ascents.objects;
    }.bind(this));
  };

  controllerFunc.prototype.changeFilter = function ClimbingApp$Climbing$changeFilters(filter, value) {
    if (filter == "today") {
      if (value) {
        this.filters['date'] = utils.obj2Date(new Date());
      } else {
        delete this.filters['date'];
      } 
    } else {
      this.filters[filter] = value;
    }
    this.loadAscents(this.filters);
  };
    
  controllerFunc.prototype.addAscent = function ClimbingApp$climbing$addAscent($event) {
    $event.cancelBubble = true;

    var newAscent = this.AscentResource.objects.$create();
    newAscent.route = null;
    newAscent.user = this.user;

    this.editAscentPopUp(newAscent, $event).then(function(newAscent) {
      this.ascentList.push(newAscent);
    }.bind(this));
  };

  controllerFunc.prototype.editAscentPopUp = function editAscentPopUp(ascent, $event) {
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
  };

  var controller = controllerParams.concat([controllerFunc]);
  app.controller('ClimbingAppClimbing', controller);
  return controller;
});
