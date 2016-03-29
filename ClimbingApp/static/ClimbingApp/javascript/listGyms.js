define(['app'],
function(app) {
  'use strict';

  var controller = ['$scope', '$state', '$mdDialog', 'GymResource', 'gyms', 
  function($scope, $state, $mdDialog, GymResource, gyms) {
    $scope.gymList = gyms;

    function editGym($event, gym) {
      var childScope = $scope.$new();
      childScope.gym = gym;
      
      childScope.acceptDialog = function($event) {
        gym.save().then(function(newGym) {
          $mdDialog.hide(newGym)
        });
      }
 
      childScope.cancelDialog = function($event) {
        $mdDialog.cancel(false);
      }
    
      return $mdDialog.show({
        templateUrl: '/static/partials/editGym.html',
        controller: 'ClimbingAppEditGym',
        locals: {
          gym: gym,
        },
        targetEvent: $event,
        scope: childScope,
        onRemoving: function() {
          childScope.$destroy();
        }
      });
    }
    
    $scope.addObj = function($event) {
      $event.originalEvent.cancelBubble = true;
      editGym($event, GymResource.one()).then(function(newGym) {
        $scope.gymList.push(newGym);
      });
    }

    $scope.editObj = function($event, gym) {
      $event.originalEvent.cancelBubble = true;
      editGym($event, gym.clone()).then(function(newGym){
        var idx = _.findIndex($scope.gymList, function(gym) { return gym.id == newGym.id });
        $scope.gymList[idx] = newGym; 
      });
    }

    $scope.deleteObj = function($event, gym) {
      $event.originalEvent.cancelBubble = true;
      var confirm = $mdDialog.confirm()
        .title("Delete this Gym?")
        .targetEvent($event)
        .ok("Delete it")
        .cancel("Don't do it");

      $mdDialog.show(confirm).then(function() {
        gym.remove().then(function() {
          $scope.gymList = _.without($scope.gymList, gym);
        });
      });
    }
  }];
  app.controller('ClimbingAppListGyms', controller);
  return controller;
});
