define(['app'],
function(app) {
  var mainController = ['$scope', '$state', '$mdDialog', 'user',
  function($scope, $state, $mdDialog, user) {
    $scope.LoggedInUser = user;


    $scope.$on('$stateChangeError', function() {
      console.error(arguments);
    });
  }];

  app.controller('ClimbingAppMainApp', mainController);
  return mainController;
});
