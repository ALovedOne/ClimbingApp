'use strict';
(function(baseView) {
  var listGymsParams = ['$scope', 'GymResource', 'AuthService'];
  var listGymsCtrl = function ClimbingApp$ListGyms() {

    this.gymList = [];
    this.GymResource.$find().then(function(gyms) {
      this.gymList = gyms;
    }.bind(this));
  }

  listGymsCtrl.prototype = Object.create(baseView.prototype);

  listGymsCtrl.prototype.editGymPriv = function ClimbingApp$listGyms$editGym($event, gym) {
    return this.$mdDialog.show({
      templateUrl: '/static/climbingApp/partials/editGym.html',
      controller: 'ClimbingAppEditGym',
      controllerAs: 'ctrl',
      locals: {
        gym: gym,
      },
      targetEvent: $event,
    });
  }

  listGymsCtrl.prototype.addGym = function ClimbingApp$listGyms$addGym($event) {
    $event.originalEvent.cancelBubble = true;
    this.editGymPriv($event, this.GymResource.$create()).then(function(newGym) {
      this.gymList.push(newGym);
    }.bind(this));
  }

  listGymsCtrl.prototype.deleteGym = function ClimbingApp$listGyms$deleteGym($event, gym) {
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

  listGymsCtrl.$inject = listGymsParams;
  angular.module('ClimbingApp').component('listGyms', {
    templateUrl: '/static/climbingApp/javascript/components/listGyms/listGyms.html',
    controller:  ClimbingApp.utils.extendCtrl(listGymsCtrl, baseView),
    bindings: {

    },
  });
})(ClimbingApp.views.BaseListView);