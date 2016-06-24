define(['app'],
function(app) {
  'use strict';

  var controller = ['$scope', '$state', '$stateParams', '$mdDialog', 'WallResource', 'gym', 'walls',
  function($scope, $state, $stateParams, $mdDialog, WallResource, gym, walls) {
    var gymId = $stateParams.gymId;
    $scope.wallList = walls.objects;
    $scope.gym = gym;

    function editWall($event, wall) {

      return $mdDialog.show({
        templateUrl: '/static/ClimbingApp/partials/editWall.html',
        controller: 'ClimbingAppEditWall',
        controllerAs: 'ctrl',
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
        wall.$delete().then(function() {
          $scope.wallList = _.without($scope.wallList, wall);
        });
      });
    }

    $scope.addWall = function($event) {
      $event.originalEvent.cancelBubble = true;
      var blankWall = WallResource.objects.$create();
      blankWall.gym = gym.resource_uri;

      editWall($event, blankWall).then(function(newWall) {
        $scope.wallList.push(newWall);
      });
    }
    }];
    
    app.controller('ClimbingAppListWalls', controller);
    return controller;
});
