'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.services = ClimbingApp.services || {};

ClimbingApp.services.UserService = (function(baseService){
  var serviceParams = ['$http', 'AuthService'];
  var serviceFn = function ClimbingApp$AuthenticatedHttp($http, AuthService) {
    console.log("AuthenticatedHttp initialize");
  
    this.$http = $http;
    this.AuthService = AuthService;
  };
  
  serviceFn.prototype = {
    get: function ClimbingApp$AuthenticatedHttp$Get(url, params) {
      return this.$http.get(url, this.__updateParams(params));
    },
  
    put: function ClimbingApp$AuthenticatedHttp$Put(url, data) {
      return this.$http.put(url, data, this.__updateParams({}));
    },
  
    post: function ClimbingApp$AuthenticatedHttp$Post(url, data) {
      return this.$http.post(url, data, this.__updateParams({}));
    },
  
    delete: function ClimbingApp$AuthenticatedHttp$Delete(url) {
      return this.$http.delete(url, this.__updateParams({}));
    },
  
    __updateParams: function ClimbingApp$AuthenticatedHttp$UpdateParams(params) {
      params = params || {};
      if (this.AuthService.isLoggedIn()) {
        params.headers = {
          'Authorization': 'ApiKey ' + this.AuthService.getUsername() + ':' + this.AuthService.getApiKey()
        }
      }
      return params;
    },
  }
  
  myApp.service('AuthenticatedHttp', serviceParams.concat([serviceFn]));
})(ClimbingApp.services.BaseService);
