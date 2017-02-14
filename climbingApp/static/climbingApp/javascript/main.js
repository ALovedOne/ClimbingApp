'use strict';

var myApp = angular.module('ClimbingApp', ['ngAria', 'ngMaterial', 'ngStorage', 'ngMessages', 'ui.router', 'ui.router.state.events', ]);

var ClimbingApp = ClimbingApp || {};
ClimbingApp.utils = ClimbingApp.utils || {};

ClimbingApp.utils.snake_case = function snake_case(name, separator) {
  var SNAKE_CASE_REGEXP = /[A-Z]/g;
  separator = separator || '_';
  return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
    return (pos ? separator : '') + letter.toLowerCase();
  });
}

ClimbingApp.utils.extendClass = function(childObj, parentObj) {
  var $inject = parentObj.$inject;
  if (childObj.$inject) {
    $inject = $inject.concat(childObj.$inject);
  }

  var fn = function() {
    var idx;

    for (idx = 0; idx < $inject.length; idx++) {
      var argName = $inject[idx];
      this[argName] = arguments[idx];
    }

    parentObj.apply(this, arguments);
    childObj.apply(this, arguments);
  }

  fn.$inject = $inject;
  fn.prototype = Object.create(parentObj.prototype);

  var props = Object.getOwnPropertyNames(childObj.prototype);
  props.forEach(function (key) {
    var desc = Object.getOwnPropertyDescriptor(childObj.prototype, key);
    Object.defineProperty(fn.prototype, key, desc);
  });

  return fn;
}

myApp.provider('stateResolver', [function() {
  this.resolveModal2 = function(name, url, returnState) {
    var name = ClimbingApp.utils.snake_case(name, '-');
    var x = {
      url: url,
      onEnter: ['$state', '$mdDialog', function ($state, $mdDialog) {
        console.log(name);
        $mdDialog.show({
          template: "<" + name + " gym=\"gym\"></" + name + ">",
        }).then(function() {
            $state.go(returnState);
          }, function() {
            $state.go(returnState);
        });
      }],
    };

    return x;
  };

  this.resolveModal = function(name, url, returnState, additional, resolve) {
    var capitalName = name.charAt(0).toUpperCase() + name.substr(1);

    return {
      url:      url,
      resolve:  resolve,
      onEnter: ['$state', '$mdDialog'].concat(additional, [ 
        function($state, $mdDialog) {
          var idx;
          var locals = {};
          for (idx = 0; idx < additional.length; idx++) {
            locals[additional[idx]] = arguments[2 + idx]; 
          }

          $mdDialog.show({
            templateUrl: 'static/climbingApp/partials/' + name + '.html',
            controller:  'ClimbingApp' + capitalName,
            controllerAs: 'ctrl',
            locals: locals,
          }).then(function() {
            $state.go(returnState);
          }, function() {
            $state.go(returnState);
          });
        }]),
    };
  }

  this.resolveAbstract = function(name, url, resolve) {
    var capitalName = name.charAt(0).toUpperCase() + name.substr(1);

    return {
      abstract: true,
      url: url,
      resolve: resolve,
      template: '<ui-view><ui-view/>',
    }
  }
  
  this.$get = function() {
    return this;
  }    
}]);

myApp.constant('ClimbingApp$BaseAddr', '');

myApp.run(['$rootScope', '$state', 'AuthService', '$transitions', function($rootScope, $state, AuthService, $transition) {

  $transition.onStart( 
    {
      to: function(state) {
        return state.data != null && state.data.authRequired === true;
      }
    },
    function (trans) {
      AuthService.waitForLoggedIn().then(function (isLoggedIn) {
        if (!isLoggedIn) {
          return AuthService.login().catch(function() {
            return $state.target('mainApp.listGyms');
          });
        }
      });
    }
  );
  
  $state.defaultErrorHandler(
    function(error) {
      console.error(error);
  });

}]);

myApp.config(['$stateProvider', '$urlRouterProvider', 'stateResolverProvider', function($stateProvider, $urlRouterProvider, stateResolver) {

  $stateProvider

  .state({name:     'mainApp',
          component:'mainApp',
  })

  .state({name:     'mainApp.listGyms', 
          url:      '/gyms',
          views: {
            '@mainApp': {
              component:  'listGyms',
            }
          },
  })

  .state({name:     'mainApp.gym',
          url:      '/gyms/:gymId',
          template: '<ui-view></ui-view>',
          abstract: true,
          resolve: {
            gym: ['$stateParams', 'GymResource', function($stateParams, GymResource) {
              var gymId = $stateParams.gymId;
              return GymResource.$get(gymId);
            }],
          },
  })

  .state({name:     'mainApp.gym.fullGym',
          url:      '/view',
          component:'fullGym',
          data: {
            authRequired: true 
          },
  })
  
  .state({name:       'mainApp.gym.climbing', 
          url:        '/climbing',
          component:  'climbing',
          data: {
            authRequired: true,
          },
  })

  /*  */
  .state('mainApp.gym.wall', stateResolver.resolveAbstract('wall', '/walls/:wallId', {
    wall: ['$stateParams', 'WallResource', function($stateParams, WallResource) {
      return WallResource.$get($stateParams.wallId);
    }],
  }))
  .state('mainApp.gym.wall.editWall',   stateResolver.resolveModal('editWall', '/edit', '^.^.listWalls', ['gym', 'wall']))

  /*  */
  .state('mainApp.gym.wall.route', stateResolver.resolveAbstract('route', '/routes/:routeId', {
    route: ['$stateParams', 'RouteResource', function($stateParams, RouteResource) {
      return RouteResource.$get($stateParams.routeId);
    }],
  }))
  .state('mainApp.gym.wall.route.editRoute',   stateResolver.resolveModal('editRoute', '/edit', '^.^.listRoutes', ['gym', 'wall', 'route']))
  .state({name:     'mainApp.gym.wall.route.listAscents', 
          url:      '/ascents',
          views: {
            '@mainApp': {
              component: 'listAscents',
            }
          },
          resolve: {
            ascents: ['route', 'AscentResource', function(route, AscentResource) {
              return AscentResource.$find({route: route.id});
            }],
          },
          data: {
            authRequired: true 
          },
  })

  $urlRouterProvider.otherwise('/gyms');
}]);

myApp.config(['$mdThemingProvider', function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  /*
      .primaryPalette('indigo')
      .accentPalette('deep-orange')
      .warnPalette('red')
      .backgroundPalette('white')
  */
    ;
}]);
