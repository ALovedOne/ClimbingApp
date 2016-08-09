define(['app'], function(app) {

  var serviceParams = ['ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$AuthService(baseAddr) {
    console.log("AuthService initialized");

    this.baseAddr = baseAddr;
  }
  
  serviceFn.prototype = {
    setAuth: function ClimbingApp$AuthService$SetAuth(userName, apiKey) {
      this.userName = userName;
      this.apiKey = apiKey;
    },

    isLoggedIn: function ClimbingApp$AuthService$IsLoggedIn() {
      return this.apiKey && this.apiKey != "";
    },

    getUsername: function() {
      return this.userName;
    },

    getApiKey: function() {
      return this.apiKey;
    },
  };

  app.service('AuthService', serviceParams.concat([serviceFn]));
  return serviceFn;
});
