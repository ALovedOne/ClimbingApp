define(['app'],
function(app) {
  'use strict';

  var controller = ['$scope', '$mdDialog', 'ascents', 'gym', 'user', 'AscentResource',
  function($scope, $mdDialog, ascents, gym, user, AscentResource) {
    $scope.ascentList = ascents.objects;
    $scope.gym = gym;


    function editAscent($event, ascent) {
      var childScope = $scope.$new();
      return $mdDialog.show({
        templateUrl: '/static/ClimbingApp/partials/editAscent.html',
        locals: {
          ascent: ascent,
          route: null,
          wall: null,
          gym: gym
        },
        controller: 'ClimbingAppEditAscent as editAscent',
        targetEvent: $event,
        scope: childScope,
        onRemoving: function() {
          childScope.$destroy();
        }
      });
    }

    $scope.addAscent = function($event) {
      $event.cancelBubble = true;
      var newAscent = AscentResource.objects.$create();
      newAscent.route = null;
      newAscent.user = user;

      editAscent($event, newAscent).then(function(newAscent) {
        $scope.ascentList.push(newAscent);
      });
    }

    $scope.editAscent = function($event, ascent) {
      $event.cancelBubble = true;
      editAscent($event, ascent.clone()).then(function(newAscent) {
        var idx = _.findIndex($scope.ascentList, function(ascent) { return ascent.id == newAscent.id });
        $scope.ascentList[idx] = newAscent;
      });
    }

    $scope.deleteAscent = function($event, ascent) {
      $event.cancelBubble = true;
      var confirm = $mdDialog.confirm()
        .title("Delete this Ascent?")
        .targetEvent($event)
        .ok("Delete Ascent")
        .cancel("Don't do it");

      $mdDialog.show(confirm).then(function() {
        ascent.$delete().then(function() {
          $scope.ascentList = _.without($scope.ascentList, route);
        });
      });
    }
  }];

  app.controller('ClimbingAppClimbing', controller);
  return controller;
});
