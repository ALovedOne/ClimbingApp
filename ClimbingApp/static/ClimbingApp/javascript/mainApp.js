define(['app'],
function(app) {
  var mainController = ['$scope', '$state', '$mdDialog', 'user',
  function($scope, $state, $mdDialog, user) {
    $scope.LoggedInUser = user;
  }];

  var loginController = ['$scope', '$state', '$stateParams', '$http', '$tastypie', '$localStorage',
  function($scope, $state, $stateParams, $http, $tastypie, $localStorage) {
    $scope.login = function($event) {
      var username = $scope.username;
      var password = $scope.password;

      $http.post('/api/v1/users/login/',
        { username: username,
          password: password}
      ).then(function(resp) {
        var username = resp.data.username;
        var apiKey   = resp.data.apiKey;
        $tastypie.setAuth(username, apiKey);
        $localStorage.username = username;
        $localStorage.apiKey   = apiKey;
        if ($stateParams.nextState) {
          $state.go($stateParams.nextState, $stateParams.nextStateParams);
        } else {
          $state.go('mainApp.listGyms');
        }
      }, function(reason) {
        console.log(reason);
      });
    };
  }];
  app.controller('ClimbingAppLogin', loginController);
  app.controller('ClimbingAppMainApp', mainController);
  return mainController;
});
