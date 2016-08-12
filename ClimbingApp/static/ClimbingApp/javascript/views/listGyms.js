define(['app', 'views/baseListView'],
function(app, baseView) {
  'use strict';

  var controllerParams = ['$scope', '$state', '$mdDialog', 'GymResource']; //, 'UserGymStatsResource'];
  var controllerFn = function($scope, $state, $mdDialog, GymResource, GymStatsResource) {
    baseView.call(this, controllerParams, arguments);

    GymResource.$find().then(function(gyms) {
      this.gymList = gyms;
    }.bind(this));
  }

  controllerFn.prototype = Object.create(baseView.prototype);

  controllerFn.prototype.editGymPriv = function ClimbingApp$listGyms$editGym($event, gym) {
    var childScope = this.$scope.$new();
    childScope.gym = gym;
    
    childScope.acceptDialog = function($event) {
      gym.save().then(function(newGym) {
        $mdDialog.hide(newGym)
      });
    }
 
    childScope.cancelDialog = function($event) {
      $mdDialog.cancel(false);
    }
    
    return this.$mdDialog.show({
      templateUrl: '/static/ClimbingApp/partials/editGym.html',
      controller: 'ClimbingAppEditGym',
      controllerAs: 'ctrl',
      locals: {
        gym: gym,
      },
      targetEvent: $event,
      scope: childScope,
      onRemoving: function() {
        childScope.$destroy();
      }
    });
  }

  controllerFn.prototype.addGym = function ClimbingApp$listGyms$addGym($event) {
    $event.originalEvent.cancelBubble = true;
    this.editGymPriv($event, this.GymResource.$create()).then(function(newGym) {
      this.gymList.push(newGym);
    }.bind(this));
  }

  controllerFn.prototype.deleteGym = function ClimbingApp$listGyms$deleteGym($event, gym) {
    $event.originalEvent.cancelBubble = true;
    var confirm = this.$mdDialog.confirm()
      .title("Delete this Gym?")
      .targetEvent($event)
      .ok("Delete it")
      .cancel("Don't do it");

    this.$mdDialog.show(confirm).then(function() {
      this.GymResource.$delete(gym).then(function() {
        this.gymList = _.without(this.gymList, gym);
      }.bind(this));
    }.bind(this));
  }

  var controller = controllerParams.concat([controllerFn]);
  app.controller('ClimbingAppListGyms', controller);
  return controller;
});
