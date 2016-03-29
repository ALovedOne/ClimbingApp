require.config({
  paths: {
    angular:      '/static/bower_components/angular/angular',
    jquery:       '/static/bower_components/jquery/dist/jquery',
    underscore:   '/static/bower_components/underscore/underscore',
    ngAria:       '/static/bower_components/angular-aria/angular-aria',
    ngAnimate:    '/static/bower_components/angular-animate/angular-animate',
    ngMaterial:   '/static/bower_components/angular-material/angular-material',
    ngMessages:   '/static/bower_components/angular-messages/angular-messages',
    ngStorage:    '/static/bower_components/ngstorage/ngStorage',
    ngResource:   '/static/bower_components/angular-resource/angular-resource',
    ngTastypie:   '/static/bower_components/angular-resource-tastypie/src/angular-resource-tastypie',
    stateRouter:  '/static/bower_components/angular-ui-router/release/angular-ui-router',
    stateHelper:  '/static/bower_components/angular-ui-router.stateHelper/statehelper',

    highcharts:   '/static/bower_components/highcharts-ng/dist/highcharts-ng',
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
    'ngTastypie':   ['angular', 'ngResource'],
    'highcharts':   ['angular'],
  },
  //Not sure about the significance of this piece below
  priority: [
    'angular'
  ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

define('app', ['angular', 'stateRouter', 'ngAria', 'ngAnimate', 'ngMessages', 'ngMaterial', 'ngResource', 'ngStorage', 'ngTastypie'],
function(angular) {
  'use strict';
  var myApp = angular.module('ClimbingApp', 
    [ 'ngAria',
      'ngMaterial',
      'ngStorage',
      'ngMessages',
      'ui.router',
      'ui.router.stateHelper',
      'ngResourceTastypie'
    ]);

  myApp.provider('stateResolver', [function() {
    this.resolve = function(name, url, resolves) {
      var capitalName = name.charAt(0).toUpperCase() + name.substr(1);

      return {
        url:        url,
        resolve:    resolves,
        views: {
          'body@mainApp': {
            templateUrl: 'static/partials/' + name + '.html',
            controller: 'ClimbingApp' + capitalName,
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
              templateUrl: 'static/partials/' + name + '.html',
              controller:  'ClimbingApp' + capitalName,
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
            templateUrl: 'static/partials/header' + capitalName + '.html',
            controller:  'ClimbingApp' + capitalName + 'Header'
          },
        }
      }
    }
    
    this.$get = function() {
      return this;
    }    
  }]);
  
  myApp.config(['$stateProvider', '$urlRouterProvider', 'stateResolverProvider', function($stateProvider, $urlRouterProvider, stateResolver) {

    $stateProvider
    
    .state('mainApp', {
      views: {
        '': {
          templateUrl: 'static/partials/mainApp.html',
          controller:  'ClimbingAppMainApp',
        },
      },
    })

    .state('mainApp.listGyms', stateResolver.resolve('listGyms', '/gyms', {
      gyms: ['GymResource', function(GymResource) {
        return GymResource.getList()
      }]
    }))

    /*  */
    .state('mainApp.gym', stateResolver.resolveAbstract('gym', '/gyms/:gymId', {
      gym: function(GymResource, $stateParams) {
        var gymId = $stateParams.gymId;
        return GymResource.one(gymId).get();
      }      
    }))
    .state('mainApp.gym.editGym',   stateResolver.resolveModal('editGym', '/edit', '^.^.listGyms', ['gym']))
    .state('mainApp.gym.listWalls', stateResolver.resolve('listWalls', '/walls', {
      walls: function(GymResource, $stateParams) {
        var gymId  = $stateParams.gymId;
        return GymResource.one(gymId).getList('walls');
      },
    }))

    /*  */
    .state('mainApp.gym.wall', stateResolver.resolveAbstract('wall', '/walls/:wallId', {
      wall: function(GymResource, $stateParams) {
        var wallId = $stateParams.wallId;
        var gymId = $stateParams.gymId;
        return GymResource.one(gymId).one("walls", wallId).get(); 
      },
    }))
    .state('mainApp.gym.wall.editWall',   stateResolver.resolveModal('editWall', '/edit', '^.^.listWalls', ['gym', 'wall']))
    .state('mainApp.gym.wall.listRoutes', stateResolver.resolve('listRoutes', '/routes', {
      routes: function(GymResource, $stateParams) {
        var wallId = $stateParams.wallId;
        var gymId = $stateParams.gymId;
        return GymResource.one(gymId).one("walls", wallId).getList('routes');
      },
    }))

    /*  */
    .state('mainApp.gym.wall.route', stateResolver.resolveAbstract('route', '/routes/:routeId', {
      route: function(GymResource, $stateParams) {
        var routeId = $stateParams.routeId;
        var wallId  = $stateParams.wallId;
        var gymId   = $stateParams.gymId;
        return GymResource.one(gymId).one("walls", wallId).one('routes', routeId).get();
      },
    }))
    .state('mainApp.gym.wall.route.editRoute',   stateResolver.resolveModal('editRoute', '/edit', '^.^.listRoutes', ['gym', 'wall', 'route']))
    .state('mainApp.gym.wall.route.listAscents', stateResolver.resolve('listAscents', '/ascents', {
      ascents: function(GymResource, $stateParams) {
        var routeId = $stateParams.routeId;
        var wallId  = $stateParams.wallId;
        var gymId   = $stateParams.gymId;
        return GymResource.one(gymId).one("walls", wallId).one('routes', routeId).getList('ascents');
      },
    }))

    .state('mainApp.colors', {
      templateUrl: 'static/partials/listColors.html',
      controller: 'ClimbingAppViewColors',
      resolve: {
        colors: function(ColorResource) {
          return ColorResource.getList();
        }
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

require(['angular', 'app', 'services', 'mainApp', 
      'listGyms',    'editGym',
      'listWalls',   'editWall',
      'listRoutes',  'editRoute',
      'listAscents', 'editAscent'], 
function(angular, app) {
  'use strict';
  
  angular.element().ready(function() {
    angular.resumeBootstrap([app['name']]);
  });
});

