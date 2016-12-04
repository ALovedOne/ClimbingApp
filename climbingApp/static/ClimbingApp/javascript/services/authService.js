'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.services = ClimbingApp.services || {};

ClimbingApp.services.UserService = (function(baseService){
  var serviceParams = ['ClimbingApp$BaseAddr', '$mdDialog', '$localStorage', 'UserResource', 'AuthenticatedHttp', '$http', '$q'];
  var serviceFn = function ClimbingApp$AuthService(baseAddr, $mdDialog, $localStorage, UserResource, AuthHttp, $http, $q) {
    this.baseAddr = baseAddr;
    this.$mdDialog = $mdDialog; 
    this.$localStorage = $localStorage;
    this.UserResource = UserResource;
    this.AuthenticatedHttp = AuthHttp;
    this.$http = $http;
    this.$q = $q;

    this.__user = null;
    this.__permissions = [];
    this.__listeners = [];
    this.__loggingIn = null;

    if (this.$localStorage.apiKey && this.$localStorage.username) {
      this.__loggingIn = this.$http.get('/api/v1/users/me/',
        {
          params: {
            apiKey: $localStorage.apiKey,
            username: $localStorage.username,
          }
        }).then(
          this.__handleAuthResponse.bind(this),
          function(err) {
            this.__clearStorage();
          }.bind(this)).finally(function () {
            this.__loggingIn = null; 
          }.bind(this));
    } else {
      this.__clearStorage();
    }
  }
  
  serviceFn.prototype = {
    authenticate: function (username, password) {
      return this.$http.post('/api/v1/users/login/',
        { username: username,
          password: password}
      ).then(
        this.__handleAuthResponse.bind(this)
      );
    }, 

    isLoggedIn: function ClimbingApp$AuthService$IsLoggedIn() {
      return this.__user != null;
    },

    waitForLoggedIn: function () {
      if (this.__loggingIn) {
        return this.__loggingIn.then(function() {
          return this.isLoggedIn();  
        }.bind(this));
      }
      var q = this.$q.defer();
      q.resolve(this.isLoggedIn());
      return q.promise;
    },

    hasPermission: function (permission) {
      if (this.__permissions) {
        return this.__permissions.find(function (x) { return x == permission});
      }
      return false;
    },

    get user() {
      return this.__user;
    },
  
    login: function() {
      return this.$mdDialog.show({
        template: "<login></login>",
      });
    },

    logout: function () {
      this.__setUser(null);
      this.__clearStorage();
    },

    registerUserAuthListener: function (listener) {
      if (this.__user != null) {
        listener(this.__user);
      };

      this.__listeners = this.__listeners.filter(function(x) { return x !== listner; }).concat(listener);
    },

    __setUser: function(user, apiKey, permissions) {
      // TODO - assert this._user == null
      this.__user = user;
      this.__permissions = permissions || [];
      if (user) {
        this.AuthenticatedHttp.setUser(user.username, apiKey);
      } else {
        this.AuthenticatedHttp.clearUser()
      }
      this.__listeners.forEach(function (fn) { fn(user) });
    },

    __clearStorage: function() {
      delete this.$localStorage.apiKey;
      delete this.$localStorage.username;
    },

    __handleAuthResponse: function (resp) {
      var apiKey = resp.data.apiKey;
      var user = this.UserResource.__makeObjFromJson(resp.data.user);

      this.$localStorage.username = user.username;
      this.$localStorage.apiKey   = apiKey;

      this.__setUser(user, apiKey, resp.data.permissions);
    },
  };
  
  myApp.service('AuthService', serviceParams.concat([serviceFn]));
})(ClimbingApp.services.BaseService);
