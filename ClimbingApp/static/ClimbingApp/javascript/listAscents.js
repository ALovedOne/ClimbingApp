define(['app'],
function(app) {
  'use strict';

  var controller = ['$scope', '$mdDialog', 'ascents', 'route', 'wall', 'gym', 'GymResource', 
  function($scope, $mdDialog, ascents, route, wall, gym, GymResource) {
    $scope.ascentList = ascents.objects;
    $scope.route = route
    $scope.wall = wall;
    $scope.gym = gym;

    function editAscent($event, ascent) {
      var childScope = $scope.$new();
      return $mdDialog.show({
        templateUrl: '/static/partials/editAscent.html',
        locals: {
          ascent: ascent,
          route: route,
          wall: wall,
          gym: gym
        },
        controller: 'ClimbingAppEditAscent',
        targetEvent: $event,
        scope: childScope,
        onRemoving: function() {
          childScope.$destroy();
        }
      });
    }

    $scope.addAscent = function($event) {
      $event.cancelBubble = true;
      editAscent($event, route.one('ascents')).then(function(newAscent) {
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
        ascent.remove().then(function() {
          $scope.ascentList = _.without($scope.ascentList, route);
        });
      });
    }

  }];

  app.controller('ClimbingAppListAscents', controller);
  return controller;
})
