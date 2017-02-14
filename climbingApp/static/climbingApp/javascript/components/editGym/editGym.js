'use strict';
(function(baseView) {
  var editGymParams = ['$scope', '$state', '$mdDialog', 'GymResource'];
  var editGymCtrl = function ClimbingApp$EditGym() {
  }

  editGymCtrl.prototype = {
    acceptDialog: function ClimbingApp$EditGym$acceptDialog($event) {
      this.GymResource.$save(this.gym).then(function(newGym) {
        this.$mdDialog.hide(newGym)
      }.bind(this));
    },

    cancelDialog: function ClimbingApp$EditGym$cancelDialog($event) {
      this.$mdDialog.cancel(false);
    },
  }

  editGymCtrl.$inject = editGymParams;
  angular.module('ClimbingApp').component('editGym', {
    templateUrl:  '/static/climbingApp/javascript/components/editGym/editGym.html',
    controller:   ClimbingApp.utils.extendClass(editGymCtrl, baseView),
    bindings: {
      gym: '<',
    },
  });
})(ClimbingApp.views.BaseModalView);
