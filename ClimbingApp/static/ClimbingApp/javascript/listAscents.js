define(['app', 'baseListView'],
function(app, baseView) {
  'use strict';

  var controllerParams = ['$scope', '$mdDialog', 'route', 'wall', 'gym', 'AscentResource'];
  var controllerFn = function($scope, $mdDialog, route, wall, gym, AscentResource) {
    baseView.call(this, controllerParams, arguments);

    AscentResource.$find({route: route.id}).then(function(ascents) {
      this.ascentList = ascents;
    }.bind(this));
  }

  controllerFn.prototype = Object.create(baseView.prototype);

  controllerFn.prototype.editAscentPriv = function ClimbingApp$EditAscent$editAscent($event, ascent) {
    var childScope = this.$scope.$new();
    return this.$mdDialog.show({
      templateUrl: '/static/ClimbingApp/partials/editAscent.html',
      locals: {
        ascent: ascent,
        route: this.route,
        wall: this.wall,
        gym: this.gym
      },
      controller: 'ClimbingAppEditAscent as editAscent',
      targetEvent: $event,
      scope: childScope,
      onRemoving: function() {
        childScope.$destroy();
      }
    });
  }

  controllerFn.prototype.addAscent = function ClimbingApp$EditAscent$addAscent($event) {
    $event.cancelBubble = true;
    var newAscent = this.AscentResource.$create();
    newAscent.route = this.route;

    this.editAscentPriv($event, newAscent).then(function(newAscent) {
      this.ascentList.push(newAscent);
    }.bind(this));
  }

  controllerFn.prototype.editAscent = function ClimbingApp$EditAscent$editAscent($event, ascent) {
    $event.cancelBubble = true;
    this.editAscentPriv($event, ascent.clone()).then(function(newAscent) {
      var idx = _.findIndex(this.ascentList, function(ascent) { return ascent.id == newAscent.id });
      this.ascentList[idx] = newAscent;
    }.bind(this));
  }

  controllerFn.prototype.deleteAscent = function ClimbingApp$EditAscent$deleteAscent($event, ascent) {
    $event.cancelBubble = true;
    var confirm = $mdDialog.confirm()
      .title("Delete this Ascent?")
      .targetEvent($event)
      .ok("Delete Ascent")
      .cancel("Don't do it");

    $mdDialog.show(confirm).then(function() {
      ascent.$delete().then(function() {
        this.ascentList = _.without(this.ascentList, route);
      });
    });
  }

  var controller = controllerParams.concat([controllerFn]);
  app.controller('ClimbingAppListAscents', controller);
  return controller;
})
