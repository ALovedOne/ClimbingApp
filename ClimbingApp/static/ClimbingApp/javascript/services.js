define(['app'], function(app) {
  'use strict';

  app.value('AnonymousUser', {
    name: "Anonymous"
  });
  
  app.service('AuthService', ['$http', '$q',  '$window', '$rootScope', '$localStorage', 'AnonymousUser',
    function($http, $q, $window, $rootScope, $localStorage, AnonymousUser) {
      var storage = $localStorage;

      var _setUser = function(user) {
        this.LoggedInUser = user;
        this.LoggedInUserToken = user.token;
        this.IsLoggedIn = (this.LoggedInUser != AnonymousUser);
        if (user.token) {
          storage.token = user.token;
        } else {
          delete storage.token;
        }
        $rootScope.$emit('newUser', this.LoggedInUser);
      }.bind(this);

      this.LoggedInUser = AnonymousUser;
      this.IsLoggedIn = false;

      this.canRegister = function() {
        return !this.IsLoggedIn;
      }

      this.canLogin = function() {
        return !this.IsLoggedIn;
      }

      this.canLogoff = function() {
        return this.IsLoggedIn;
      }

      this.login = function(username, password) {
        console.assert(this.canLogin(), "Logging in over session");

        return $q(function(resolve, reject) {
          $http.post('/api/token', { 
            username: username,
            password: password
          }).then(function(response) {
            // Login successful
            var user = response.data;
            _setUser(user);
            resolve(user);
          }, function(reason) {
            // Login failed
            // TODO - show error to user
            reject(reason.data);
          });
        });
      };

      this.verifyToken = function(userToken) {
        console.assert(this.canLogin(), "Verify Token over existing session");

        return $q(function(resolve, reject) {
          $http.get('/api/user',{
            headers: {
              'Authorization': 'Token ' + userToken
            }
          }).then(function(response) {
            // Verify successful
            var user = response.data;
            _setUser(user);
            resolve(user);
          }, function(reason) {
            // Verify failed
            // TODO - show error to user
            reject(reason.status);
          });
        });
      }
  
      this.register = function(username, password) {
        return $q(function(resolve, reject) {
          $http.post('/api/register', {
            email: username,
            password: password
          }).then(function(response) {
            // Register successful
            var user = response.data;
            _setUser(user);
            resolve(user);
          }, function(reason) {
            // Register failed
            // TODO - show error to user
            reject(reason.status);
          });
        });
      }

      this.logout = function() {
        console.assert(this.IsLoggedIn, "Logging out when not logged in");
        _setUser(AnonymousUser);
      }

      if (storage.token) {
        this.LoggedInUserToken = storage.token;
        this.verifyToken(storage.token); 
      }

  }]);

  function addColorToHex(color) {
    color.hexValue = function() {
      return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    };

    color.contrastColorHexValue = function() {
      var r = this.r * 0.299;
      var g = this.g * 0.587;
      var b = this.b * 0.114;
            
      return (r + g + b) > 104? "black": "white";
    };
  }
  
  app.factory(
    'GymResource', ['$tastypieProvider', 'AuthService', function($tastypieProvider, AuthService) {
      Restangular.extendModel("routes", function(model) {
        if (model.color) {
          addColorToHex(model.color);
        }

        return model;
      });
      Restangular.addFullRequestInterceptor(function(element, operation, what, url) {
        var ret = {};
        if (AuthService.LoggedInUserToken) {
          ret['headers'] = ret['headers'] || {};
          ret['headers']['Authorization'] = 'Token ' + AuthService.LoggedInUserToken;
        }
        return ret;
      });
      return Restangular.service('gyms');
  }]);
  
  /*
  app.factory(
    'ColorResource', ['Restangular', function(Restangular) {
      Restangular.extendModel("colors", function(model) {
        addColorToHex(model); 
        return model;
      });
      return Restangular.service('colors');
  }]);
  
  app.factory(
    'DifficultyResource', ['Restangular', function(Restangular) {
      return Restangular.service('difficulties');
  }]);
  
  app.factory(
    'UserResource', ['Restangular', function(Restangular) {
      return Restangular.service('users');
  }]);
  */
});
