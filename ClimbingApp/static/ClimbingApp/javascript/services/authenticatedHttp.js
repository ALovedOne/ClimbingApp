'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.services = ClimbingApp.services || {};

ClimbingApp.services.UserService = (function(baseService){
  var serviceParams = ['$http'];
  var serviceFn = function ClimbingApp$AuthenticatedHttp($http) {
    console.log("AuthenticatedHttp initialize");
  
    this.$http = $http;
    this.__apiKey = '';
    this.__username = '';
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

    setUser: function ClimbingApp$AuthenticatedHttp$setUserCredentials(username, apiKey) {
      this.__apiKey = apiKey;
      this.__username = username;
    },

    clearUser: function() {
      this.__apiKey = '';
      this.__username = '';
    },
  
    __updateParams: function ClimbingApp$AuthenticatedHttp$UpdateParams(params) {
      params = params || {};

      if (this.__apiKey != '') {
        params.headers = {
          'Authorization': 'ApiKey ' + this.__username + ':' + this.__apiKey
        }
      }
      return params;
    },
  }
  
  myApp.service('AuthenticatedHttp', serviceParams.concat([serviceFn]));
})(ClimbingApp.services.BaseService);
