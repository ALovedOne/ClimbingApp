'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.services = ClimbingApp.services || {};

ClimbingApp.services.UserService = (function(baseService){
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
  
  myApp.service('AuthService', serviceParams.concat([serviceFn]));
})(ClimbingApp.services.BaseService);
