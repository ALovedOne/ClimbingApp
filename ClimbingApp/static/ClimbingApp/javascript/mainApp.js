define(['app'],
function(app) {
  var mainController = ['$scope', '$state', '$mdDialog', 'AuthService',
  function($scope, $state, $mdDialog, AuthService) {
    $scope.AuthService = AuthService;

    $scope.login = function($event) {

      $mdDialog.show({
        templateUrl: '/static/partials/loginForm.html',
        controller: loginController,
        targetEvent: $event,
      }).then(function(user) {
      }, function() {
      });
    }

    $scope.logout = function($event) {
      AuthService.logout();
    }

    $scope.register = function($event) {
      $mdDialog.show({
        templateUrl: '/static/partials/registerForm.html',
        controller: registerController,
        targetEvent: $event
      });
    }
  }];

  var loginController = ['$scope', '$mdDialog', 'AuthService', 
  function($scope, $mdDialog, AuthService) {
    $scope.errors = {};

    $scope.acceptDialog = function($event) {
      AuthService.login($scope.username, $scope.password).then(function(user) {
        $mdDialog.hide(user)
      }, function(failureReason) {
        $scope.errors = {};
        $scope.errors[failureReason] = true;
      });
    }
  
    $scope.cancelDialog = function($event) {
      $mdDialog.cancel();
    }
  
  }];
  
  var registerController = ['$scope', '$mdDialog', 'AuthService', 
  function($scope, $mdDialog, AuthService) {
    $scope.acceptDialog = function($event) {
      AuthService.register($scope.username, $scope.password).then(function(x) {
        $mdDialog.hide(x);
      });
    }
  
    $scope.cancelDialog = function($event) {
      $mdDialog.cancel();
    }
  }];
  
  app.controller('ClimbingAppMainApp', mainController);
  return mainController;
  
});
