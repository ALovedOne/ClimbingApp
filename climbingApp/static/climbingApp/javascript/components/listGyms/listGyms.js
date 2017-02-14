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

  listGymsCtrl.prototype.addGym = function ClimbingApp$listGyms$addGym($event) {
    $event.cancelBubble = true;

    var newGym = this.GymResource.$create();
    this.gymList.unshift(newGym);
  }

  listGymsCtrl.prototype.gymDeleted = function ClimbingApp$listGyms$gymDeleted(gym) {
    this.GymResource.$delete(gym).then(function () {
      this.gymList = this.gymList.filter(function(g) { return g.resource_uri != gym.resource_uri; });
    }.bind(this));
  };

  listGymsCtrl.prototype.gymUpdated = function (gym) {
    this.GymResource.$save(gym).then(function (newGym) {
      var idx = this.gymList.findIndex(function (g) { return g.resource_uri == newGym.resource_uri; });
      if (idx >= 0) {
        this.gymList[idx] = newGym;
      } else {
        this.gymList.push(newGym);
      };
    }.bind(this));
  };

  listGymsCtrl.$inject = listGymsParams;
  angular.module('ClimbingApp').component('listGyms', {
    templateUrl: '/static/climbingApp/javascript/components/listGyms/listGyms.html',
    controller:  ClimbingApp.utils.extendClass(listGymsCtrl, baseView),
    bindings: {

    },
  });
})(ClimbingApp.views.BaseListView);
