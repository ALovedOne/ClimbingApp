'use strict';
(function(baseView) {
  var singleGymParams = ['$scope', '$mdDialog', 'AuthService', 'GymResource'];
  var singleGymCtrl = function ClimbingApp$ListGyms() {
    this.editMode = false;

    if (this.gym.id === undefined) {
      this.editMode = true;
    }
  }

  singleGymCtrl.prototype = {
    editGym: function ($event) {
      $event.stopPropagation();

      if (!this.AuthService.hasPermission('ClimbingApp.change_gym')) {
        return;
      }
      this.editMode = true;
      this.editGymObj = this.GymResource.copy(this.gym);
    },

    saveGym: function ($event) {
      $event.stopPropagation();

      this.onUpdate({ obj: this.editGymObj});
      this.__closeGym();
    },

    closeGym: function($event) {
      $event.stopPropagation();
      this.__closeGym();
    },

    __closeGym: function() {
      this.editMode = false; 
      this.editGymObj = null;
    },
  };

  singleGymCtrl.$inject = singleGymParams;
  angular.module('ClimbingApp').component('singleGym', {
    templateUrl: '/static/climbingApp/javascript/components/singleGym/singleGym.html',
    controller:  ClimbingApp.utils.extendClass(singleGymCtrl, baseView),
    bindings: {
      gym: '<',
      onDelete: '&',
      onUpdate: '&',
    },
  });
})(ClimbingApp.views.BaseView);
