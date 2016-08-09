require.config({
  paths: {
    angular:      '/static/bower_components/angular/angular.min',
    jquery:       '/static/bower_components/jquery/dist/jquery.min',
    underscore:   '/static/bower_components/underscore/underscore',
    ngAria:       '/static/bower_components/angular-aria/angular-aria',
    ngAnimate:    '/static/bower_components/angular-animate/angular-animate',
    ngMaterial:   '/static/bower_components/angular-material/angular-material.min',
    ngMessages:   '/static/bower_components/angular-messages/angular-messages',
    ngStorage:    '/static/bower_components/ngstorage/ngStorage',
    ngResource:   '/static/bower_components/angular-resource/angular-resource',
    stateRouter:  '/static/bower_components/angular-ui-router/release/angular-ui-router',
    stateHelper:  '/static/bower_components/angular-ui-router.stateHelper/statehelper',

    ngNvd3:       '/static/bower_components/angular-nvd3/dist/angular-nvd3',
    nvd3:         '/static/bower_components/nvd3/build/nv.d3',
    d3:           '/static/bower_components/d3/d3',
    },
  
  //Dependencies defined below
  shim: {
    'angular' : {
      'exports' : 'angular',
      'deps': ['jquery']
    },
    'stateRouter':  ['angular', 'stateHelper'],
    'stateHelper':  ['angular'],
    'ngAria':       ['angular'],
    'ngAnimate':    ['angular'],
    'ngMaterial':   ['angular'],
    'ngMessages':   ['angular'],
    'ngResource':   ['angular'],
    'ngNvd3':       ['angular', 'nvd3'],
    'nvd3':         ['d3'],
  },
  //Not sure about the significance of this piece below
  priority: [
    'angular'
  ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

define('app', ['angular', 'stateRouter', 'ngAria', 'ngAnimate', 'ngMessages', 'ngMaterial', 'ngResource', 'ngStorage', 'underscore'],
function(angular) {
  'use strict';
  var myApp = angular.module('ClimbingApp', 
    [ 'ngAria',
      'ngMaterial',
      'ngStorage',
      'ngMessages',
      'ui.router',
      'ui.router.stateHelper',
      'nvd3',
    ]);

  myApp.provider('stateResolver', [function() {
    this.resolve = function(name, url, resolves) {
      var capitalName = name.charAt(0).toUpperCase() + name.substr(1);

      return {
        url:        url,
        resolve:    resolves,
        views: {
          'body@mainApp': {
            templateUrl: 'static/ClimbingApp/partials/' + name + '.html',
            controller: 'ClimbingApp' + capitalName,
            controllerAs: 'ctrl'
          },
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
        views: {
          'header@mainApp': {
            templateUrl: 'static/ClimbingApp/partials/header' + capitalName + '.html',
            controller:  'ClimbingApp' + capitalName + 'Header'
          },
        }
      }
    }
    
    this.$get = function() {
      return this;
    }    
  }]);

  myApp.constant('ClimbingApp$BaseAddr', 'https://climbingapp.from-ring-zero.com');

  myApp.run(['$rootScope', '$state', '$localStorage', function($rootScope, $state, $localStorage) {
    $rootScope.$on('$stateChangeError', 
    function(event, toState, toParams, fromState, fromParams, error){ 
      if (error.status == 401) {
        $state.go('login', {
          nextState: toState,
          nextStateParams: toParams
        });
      }
    });

    if ($localStorage.apiKey) {
      // TODO - add login?
    }
  }]);
  
  myApp.config(['$stateProvider', '$urlRouterProvider', 'stateResolverProvider', function($stateProvider, $urlRouterProvider, stateResolver) {

    $stateProvider

    .state('login', {
      views: {
        '': {
          templateUrl: 'static/ClimbingApp/partials/login.html',
          controller:  'ClimbingAppLogin',
        },
      },
      url: '/login',
      params: {
        nextState: null,
        nextStateParams: null,
      },
    })
    
    .state('mainApp', {
      views: {
        '': {
          templateUrl: 'static/ClimbingApp/partials/mainApp.html',
          controller:  'ClimbingAppMainApp',
        },
      },
      resolve: {
        user: ['UserResource', function(UserResource) {
          return UserResource.$get('me');
        }],
      },
    })

    .state('mainApp.listGyms', stateResolver.resolve('listGyms', '/gyms'))

    /*  */
    .state('mainApp.gym', stateResolver.resolveAbstract('gym', '/gyms/:gymId', {
      gym: ['$stateParams', 'GymResource', function($stateParams, GymResource) {
        var gymId = $stateParams.gymId;
        return GymResource.$get(gymId);
      }],
    }))
    .state('mainApp.gym.editGym',   stateResolver.resolveModal('editGym', '/edit', '^.^.listGyms', ['gym']))
    .state('mainApp.gym.listWalls', stateResolver.resolve('listWalls', '/walls', {
      walls: ['gym', 'WallResource', function(gym, WallResource) {
        return WallResource.$find({gym: gym.id});
      }],
    }))

    .state('mainApp.gym.climbing', stateResolver.resolve('climbing', '/climbing', {}))
    .state('mainApp.gym.fullGym',  stateResolver.resolve('fullGym', '/full', {}))


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
//      .primaryPalette('indigo')
//      .accentPalette('deep-orange')
//      .warnPalette('red')
//      .backgroundPalette('white')
      ;
  }]);

  myApp.controller('ClimbingAppGymHeader', ['$scope', 'gym',
    function($scope, gym) {
        $scope.gym = gym;
    }]);

  myApp.controller('ClimbingAppWallHeader', ['$scope', 'gym', 'wall',
    function($scope, gym, wall) {
      $scope.gym = gym;
      $scope.wall = wall;
    }]);

  myApp.controller('ClimbingAppRouteHeader', ['$scope', 'gym', 'wall', 'route',
    function($scope, gym, wall, route) {
      $scope.gym = gym;
      $scope.wall = wall;
      $scope.route = route;
    }]);

  return myApp;
});

require(['angular', 'app', 'mainApp', 'ngNvd3', 
      'listGyms',    'editGym',
      'listWalls',   'editWall',
      'listRoutes',  'editRoute',
      'listAscents', 'editAscent',
      'climbing', 
      'fullGym', 
      'services/authService',
      'services/userService',
      'services/colorService',
      'services/difficultyService',
      'services/outcomeService',
      'services/gymService',
      'services/wallService',
      'services/routeService',
      'services/ascentService',
      'services/fullGymService', ], 
function(angular, app) {
  'use strict';
  
  angular.element().ready(function() {
    angular.resumeBootstrap([app['name']]);
  });
});

