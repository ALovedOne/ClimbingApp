define(['app'],
function(app) {
  'use strict';

  var controller = ['$scope', '$state', '$mdDialog', 'GymResource', 'gyms', 
  function($scope, $state, $mdDialog, GymResource, gyms) {
    $scope.gymList = gyms.objects;

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
        templateUrl: '/static/ClimbingApp/partials/editGym.html',
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
      editGym($event, GymResource.objects.$create()).then(function(newGym) {
        $scope.gymList.push(newGym);
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
        gym.$delete().then(function() {
          $scope.gymList = _.without($scope.gymList, gym);
        });
      });
    }
  }];
  app.controller('ClimbingAppListGyms', controller);
  return controller;
});
