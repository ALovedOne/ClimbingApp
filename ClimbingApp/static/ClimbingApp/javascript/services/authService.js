define(['app'], function(app) {

  var serviceParams = ['$http', 'ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$AuthService($http, baseAddr) {
    this.$http = $http;
    this.baseAddr = baseAddr;
  }
  
  serviceFn.prototype = {
    setAuth: function ClimbingApp$AuthService$SetAuth(userName, apiKey) {
      this.userName = userName;
      this.apiKey = apiKey;
    },

    isLoggedIn: function ClimbingApp$AuthService$IsLoggedIn() {
      return this.apiKey && this.apiKey != "";
    }
  };

  app.service('AuthService', serviceParams.concat([serviceFn]));
  return serviceFn;
});
