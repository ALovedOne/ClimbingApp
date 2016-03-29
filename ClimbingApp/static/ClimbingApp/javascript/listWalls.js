define(['app'],
function(app) {
  'use strict';

  var controller = ['$scope', '$state', '$stateParams', '$mdDialog', 'GymResource', 'gym', 'walls',
  function($scope, $state, $stateParams, $mdDialog, GymResource, gym, walls) {
    var gymId = $stateParams.gymId;
    $scope.wallList = walls;
    $scope.gym = gym;

    function editWall($event, wall) {

      return $mdDialog.show({
        templateUrl: '/static/partials/editWall.html',
        controller: 'ClimbingAppEditWall',
        locals: {
          wall: wall,
          gym: gym,
        },
        targetEvent: $event,
      });
    }

    $scope.deleteWall = function($event, wall) {
      $event.originalEvent.cancelBubble = true;
      var confirm = $mdDialog.confirm()
        .title("Delete this Wall?")
        .targetEvent($event)
        .ok("Delete it")
        .cancel("Don't do it");

      $mdDialog.show(confirm).then(function() {
        wall.remove().then(function() {
          $scope.wallList = _.without($scope.wallList, wall);
        });
      });
    }

    $scope.addWall = function($event) {
      $event.originalEvent.cancelBubble = true;
      var blankWall = gym.one('walls');
      blankWall.gymId = gymId;
      editWall($event, blankWall).then(function(newWall) {
        $scope.wallList.push(newWall);
      });
    }

    $scope.editWall = function($event, wall) {
      $event.originalEvent.cancelBubble = true;
      editWall($event, wall.clone()).then(function(newWall) {
        var idx = _.findIndex($scope.wallList, function(wall) { return wall.id == newWall.id });
        $scope.wallList[idx] = newWall;
      });
    }
    }];
    
    app.controller('ClimbingAppListWalls', controller);
    return controller;
});