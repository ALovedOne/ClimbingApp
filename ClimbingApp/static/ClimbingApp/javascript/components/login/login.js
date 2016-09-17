'use strict';
(function(baseView) {  
  var loginCtrlParams = ['$scope', '$state', '$stateParams', '$http', '$localStorage', 'AuthService'];
  var loginCtrl = function ClimbingApp$LoginController() {
    baseView.call(this, loginCtrlParams, arguments);
  }
  
  loginCtrl.prototype =  Object.create(baseView.prototype);
  loginCtrl.prototype.login = function ClimbingApp$LoginController$Login($event) {
      var username = this.$scope.username;
      var password = this.$scope.password;

      this.$http.post('/api/v1/users/login/',
        { username: username,
          password: password}
      ).then(function(resp) {
        var username = resp.data.username;
        var apiKey   = resp.data.apiKey;

        this.AuthService.setAuth(username, apiKey);

        this.$localStorage.username = username;
        this.$localStorage.apiKey   = apiKey;

        if (this.$stateParams.nextState) {
          this.$state.go(this.$stateParams.nextState, this.$stateParams.nextStateParams);
        } else {
          this.$state.go('mainApp.listGyms');
        }
      }.bind(this), function(reason) {
        console.log(reason);
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
