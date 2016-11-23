'use strict';
(function(baseView) {  
  var loginCtrlParams = ['$scope', '$state', '$stateParams', '$http', '$localStorage', '$mdDialog', 'AuthService'];
  var loginCtrl = function ClimbingApp$LoginController() {
    baseView.call(this, loginCtrlParams, arguments);
  }
  
  loginCtrl.prototype =  Object.create(baseView.prototype);
  loginCtrl.prototype.login = function ClimbingApp$LoginController$Login($event) {
      var username = this.$scope.username;
      var password = this.$scope.password;

      this.AuthService.authenticate(username, password).then(function() {
        this.$mdDialog.hide();
      }.bind(this));
  }
  
  angular.module('ClimbingApp').component('login', {
    templateUrl: '/static/ClimbingApp/javascript/components/login/login.html',
    controller: loginCtrlParams.concat(loginCtrl),
    bindings: {
      nextState: '<',
      nextStateParams: '<',
    }
  });
})(ClimbingApp.views.BaseView);
