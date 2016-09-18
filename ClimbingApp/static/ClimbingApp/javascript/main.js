'use strict';

  var myApp = angular.module('ClimbingApp', ['ngAria', 'ngMaterial', 'ngStorage', 'ngMessages', 'ui.router', ]);

  myApp.provider('stateResolver', [function() {
    this.resolve = function(name, url, resolves) {
      var capitalName = name.charAt(0).toUpperCase() + name.substr(1);

      return {
        url:        url,
        resolve:    resolves,
        views: {
          templateUrl: 'static/ClimbingApp/partials/' + name + '.html',
          controller: 'ClimbingApp' + capitalName,
          controllerAs: 'ctrl'
        }
      }
    }

    this.resolveModal = function(name, url, returnState, additional, resolve) {
      var capitalName = name.charAt(0).toUpperCase() + name.substr(1);

      return {
        url:      url,
        resolve:  resolve,
        onEnter: ['$stateParams', '$state', '$mdDialog'].concat(additional, [ 
          function($stateParams, $state, $mdDialog) {
            var idx;
            var locals = {};
            for (idx = 0; idx < additional.length; idx++) {
              locals[additional[idx]] = arguments[3 + idx]; 
            }

            $mdDialog.show({
              templateUrl: 'static/ClimbingApp/partials/' + name + '.html',
              controller:  'ClimbingApp' + capitalName,
              controllerAs: 'ctrl',
              locals: locals,
            }).then(function() {
              $state.go(returnState);
            }, function() {
              $state.go(returnState);
            });
          }]),
      }
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

  myApp.run(['$rootScope', '$state', '$localStorage', 'AuthService', function($rootScope, $state, $localStorage, AuthService) {

    $rootScope.$on('$stateChangeError', 
    function(event, toState, toParams, fromState, fromParams, error){ 
      if (error.status == 401) {
        $state.go('login', {
          nextState: toState,
          nextStateParams: toParams
        });
        return;
      } 

      console.error(error);
    });

    if ($localStorage.apiKey) {
      AuthService.setAuth($localStorage.username, $localStorage.apiKey);
    }
  }]);

  myApp.config(['$stateProvider', '$urlRouterProvider', 'stateResolverProvider', function($stateProvider, $urlRouterProvider, stateResolver) {

    $stateProvider

    .state({name:     'login',
            url:      '/login',
            component:'login',
            params: {
              nextState: null,
              nextStateParams: null,
            },
    })
    .state({name:     'mainApp',
            component:'mainApp',
            resolve: {
              user: ['UserResource', function(UserResource) {
                return UserResource.$get('me');
              }],
            },
    })
    .state({name:       'mainApp.listGyms', 
            url:        '/gyms',
            views: {
              '@mainApp': {
                component:  'listGyms',
              }
            }
    })

    .state('mainApp.gym', stateResolver.resolveAbstract('gym', '/gyms/:gymId', {
      gym: ['$stateParams', 'GymResource', function($stateParams, GymResource) {
        var gymId = $stateParams.gymId;
        return GymResource.$get(gymId);
      }],
    }))
    .state({name:       'mainApp.gym.fullGym',
            url:        '/full',
            views: {
              '@mainApp': {
                component:  'fullGym',
              }
            }
    })

    /*  */
    .state('mainApp.gym.editGym',   stateResolver.resolveModal('editGym', '/edit', '^.^.listGyms', ['gym']))
    .state('mainApp.gym.listWalls', stateResolver.resolve('listWalls', '/walls', {
      walls: ['gym', 'WallResource', function(gym, WallResource) {
        return WallResource.$find({gym: gym.id});
      }],
    }))

    .state('mainApp.gym.climbing', stateResolver.resolve('climbing', '/climbing', {}))


    /*  */
    .state('mainApp.gym.wall', stateResolver.resolveAbstract('wall', '/walls/:wallId', {
      wall: ['$stateParams', 'WallResource', function($stateParams, WallResource) {
        return WallResource.$get($stateParams.wallId);
      }],
    }))
    .state('mainApp.gym.wall.editWall',   stateResolver.resolveModal('editWall', '/edit', '^.^.listWalls', ['gym', 'wall']))
    .state('mainApp.gym.wall.listRoutes', stateResolver.resolve('listRoutes', '/routes', {
      routes: ['wall', 'RouteResource', function(wall, RouteResource) {
        return RouteResource.$find({wall: wall.id, active: true});
      }],
    }))

    /*  */
    .state('mainApp.gym.wall.route', stateResolver.resolveAbstract('route', '/routes/:routeId', {
      route: ['$stateParams', 'RouteResource', function($stateParams, RouteResource) {
        return RouteResource.$get($stateParams.routeId);
      }],
    }))
    .state('mainApp.gym.wall.route.editRoute',   stateResolver.resolveModal('editRoute', '/edit', '^.^.listRoutes', ['gym', 'wall', 'route']))
    .state('mainApp.gym.wall.route.listAscents', stateResolver.resolve('listAscents', '/ascents', {
      ascents: ['route', 'AscentResource', function(route, AscentResource) {
        return AscentResource.$find({route: route.id});
      }],
    }))

    .state('mainApp.colors', {
      templateUrl: 'static/ClimbingApp/partials/listColors.html',
      controller: 'ClimbingAppViewColors',
      resolve: {
        colors: ['ColorResource', function(ColorResource) {
          return ColorResource.objects.$find();
        }],
      },
      url: '/admin/colors',
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
