define(['app', 'baseListView'],
function(app, baseView) {
  'use strict';

  var controllerParams = ['$scope', '$state', '$stateParams', '$mdDialog', 'gym', 'WallResource'];
  var controllerFn = function($scope, $state, $stateParams, $mdDialog, gym, WallResource) {
    baseView.call(this, controllerParams, arguments);

    WallResource.$find({gym: gym.id}).then(function(walls) {
      this.wallList = walls;
    }.bind(this));
  }

  controllerFn.prototype = Object.create(baseView.prototype);

  controllerFn.prototype.editWallPriv = function ClimbingApp$listWalls$editWall($event, wall) {
    return this.$mdDialog.show({
      templateUrl: '/static/ClimbingApp/partials/editWall.html',
      controller: 'ClimbingAppEditWall',
      controllerAs: 'ctrl',
      locals: {
        wall: wall,
        gym: this.gym,
      },
      targetEvent: $event,
    });
  }

  controllerFn.prototype.deleteWall = function ClimbingApp$listWalls$deleteWall($event, wall) {
    $event.originalEvent.cancelBubble = true;
    var confirm = this.$mdDialog.confirm()
      .title("Delete this Wall?")
      .targetEvent($event)
      .ok("Delete it")
      .cancel("Don't do it");

    this.$mdDialog.show(confirm).then(function() {
      wall.$delete().then(function() {
        this.wallList = _.without($scope.wallList, wall);
      }.bind(this));
    }.bind(this));
  }

  controllerFn.prototype.addWall = function ClimbingApp$listWalls$addWall($event) {
    $event.originalEvent.cancelBubble = true;
    var blankWall = this.WallResource.$create();
    blankWall.gym = this.gym.resource_uri;

    this.editWallPriv($event, blankWall).then(function(newWall) {
      this.wallList.push(newWall);
    }.bind(this));
  }
  
  var controller = controllerParams.concat([controllerFn]);
  app.controller('ClimbingAppListWalls', controller);
  return controller;
});
