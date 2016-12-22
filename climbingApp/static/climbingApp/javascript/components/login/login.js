'use strict';
(function(baseView) {  
  var loginCtrlParams = ['$scope', '$state', '$stateParams', '$http', '$localStorage', '$mdDialog', 'AuthService'];
  var loginCtrl = function ClimbingApp$LoginController() {

  }
  
  loginCtrl.prototype =  Object.create(baseView.prototype);
  loginCtrl.prototype.login = function ClimbingApp$LoginController$Login($event) {
      var username = this.$scope.username;
      var password = this.$scope.password;

      this.AuthService.authenticate(username, password).then(function() {
        this.$mdDialog.hide();
      }.bind(this));
  }
  loginCtrl.$inject = loginCtrlParams;
  
  angular.module('ClimbingApp').component('login', {
    templateUrl: '/static/climbingApp/javascript/components/login/login.html',
    controller: ClimbingApp.utils.extendCtrl(loginCtrl, baseView),
    bindings: {
      nextState: '<',
      nextStateParams: '<',
    }
  });
})(ClimbingApp.views.BaseView);
