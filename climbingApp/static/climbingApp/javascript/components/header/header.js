'use strict';
(function(baseView) {

  var headerCtrl = function ClimbingApp$Header() {
    this.AuthService.registerUserAuthListener(this.__onUserChange.bind(this));
  }
  headerCtrl.$inject = ['$scope', '$state', 'AuthService'];

  headerCtrl.prototype = {
    __onUserChange: function (user) {
      this.user = user;
    }
  };

  angular.module('ClimbingApp').component('header', {
    templateUrl: '/static/climbingApp/javascript/components/header/header.html',
    controller:  ClimbingApp.utils.extendCtrl(headerCtrl, baseView),
    bindings: {
      user: '=',
    },
  });
})(ClimbingApp.views.BaseView);
