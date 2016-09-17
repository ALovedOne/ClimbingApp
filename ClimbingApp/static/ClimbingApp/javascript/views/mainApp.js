var mainController = ['$scope', '$state', '$mdDialog', 'user',
function($scope, $state, $mdDialog, user) {
  $scope.LoggedInUser = user;
}];

var loginController = ['$scope', '$state', '$stateParams', '$http', '$localStorage', 'AuthService',
function($scope, $state, $stateParams, $http, $localStorage, AuthService) {
  $scope.login = function($event) {
    var username = $scope.username;
    var password = $scope.password;

    $http.post('/api/v1/users/login/',
      { username: username,
        password: password}
    ).then(function(resp) {
      var username = resp.data.username;
      var apiKey   = resp.data.apiKey;

      AuthService.setAuth(username, apiKey);

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
myApp.controller('ClimbingAppLogin', loginController);
myApp.controller('ClimbingAppMainApp', mainController);
