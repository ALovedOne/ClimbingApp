'use strict';
(function(baseView) {
  var mainAppCtrl = function ClimbingApp$MainApp() {

  }

  angular.module('ClimbingApp').component('mainApp', {
    templateUrl: '/static/climbingApp/javascript/components/mainApp/mainApp.html',
    controller: ClimbingApp.utils.extendClass(mainAppCtrl, baseView),
    bindings: {
      user: '<',
    },
  });
})(ClimbingApp.views.BaseView);
