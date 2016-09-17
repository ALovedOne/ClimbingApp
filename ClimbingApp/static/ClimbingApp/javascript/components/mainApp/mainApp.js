'use strict';
(function(baseView) {
  var mainAppParams = ['$scope', '$state'];
  var mainAppCtrl = function ClimbingApp$MainApp() {
    baseView.call(this, mainAppParams, arguments);
  }

  mainAppCtrl.prototype = Object.create(baseView.prototype);

  angular.module('ClimbingApp').component('mainApp', {
    templateUrl: '/static/ClimbingApp/javascript/components/mainApp/mainApp.html',
    controller: mainAppParams.concat(mainAppCtrl),
    bindings: {
      user: '<',
    },
  });
})(ClimbingApp.views.BaseView);
