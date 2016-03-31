define(['app'],
function(app) {
  var mainController = ['$scope', '$state', '$mdDialog', 'user',
  function($scope, $state, $mdDialog, user) {
    $scope.LoggedInUser = user;
  }];

  app.controller('ClimbingAppMainApp', mainController);
  return mainController;
  
});
