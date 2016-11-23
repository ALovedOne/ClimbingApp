'use strict';
(function(baseView) {
  var headerParams = ['$scope', '$state', 'AuthService'];
  var headerCtrl = function ClimbingApp$Header() {
    baseView.call(this, headerParams, arguments);

    this.AuthService.registerUserAuthListener(this.__onUserChange.bind(this));
  }

  headerCtrl.prototype = Object.create(baseView.prototype);

  headerCtrl.prototype.__onUserChange = function (user) {
    this.user = user;
  }

  angular.module('ClimbingApp').component('header', {
    templateUrl: '/static/ClimbingApp/javascript/components/header/header.html',
    controller:  headerParams.concat(headerCtrl),
    bindings: {
      user: '=',
    },
  });
})(ClimbingApp.views.BaseView);
