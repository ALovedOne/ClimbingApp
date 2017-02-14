'use strict';
(function(baseView) {

  var listAscentsParams = ['$scope', '$mdDialog', 'AscentResource'];
  var listAscentsCtrl = function() {
  }

  listAscentsCtrl.prototype = Object.create(baseView.prototype);

  listAscentsCtrl.prototype.editAscentPriv = function ClimbingApp$EditAscent$editAscent($event, ascent) {
    return this.$mdDialog.show({
      templateUrl: '/static/climbingApp/partials/editAscent.html',
      locals: {
        ascent: ascent,
        route: this.route,
        wall: this.wall,
        gym: this.gym
      },
      controller: 'ClimbingAppEditAscent as editAscent',
      targetEvent: $event,
    });
  }

  listAscentsCtrl.prototype.addAscent = function ClimbingApp$EditAscent$addAscent($event) {
    $event.cancelBubble = true;
    var newAscent = this.AscentResource.$create();
    newAscent.route = this.route;

    this.editAscentPriv($event, newAscent).then(function(newAscent) {
      this.ascents.push(newAscent);
    }.bind(this));
  }

  listAscentsCtrl.prototype.editAscent = function ClimbingApp$EditAscent$editAscent($event, ascent) {
    $event.cancelBubble = true;
    this.editAscentPriv($event, ascent.clone()).then(function(newAscent) {
      var idx = _.findIndex(this.ascents, function(ascent) { return ascent.id == newAscent.id });
      this.ascents[idx] = newAscent;
    }.bind(this));
  }

  listAscentsCtrl.prototype.deleteAscent = function ClimbingApp$EditAscent$deleteAscent($event, ascent) {
    $event.cancelBubble = true;
    var confirm = $mdDialog.confirm()
      .title("Delete this Ascent?")
      .targetEvent($event)
      .ok("Delete Ascent")
      .cancel("Don't do it");

    $mdDialog.show(confirm).then(function() {
      ascent.$delete().then(function() {
        this.ascents = _.without(this.ascents, route);
      });
    });
  }

  listAscentsCtrl.$inject = listAscentsParams;
  angular.module('ClimbingApp').component('listAscents', {
    templateUrl: '/static/climbingApp/javascript/components/listAscents/listAscents.html',
    controller: ClimbingApp.utils.extendClass(listAscentsCtrl, baseView),
    bindings: {
      gym:      '<',
      wall:     '<',
      route:    '<',
      ascents:  '<', 
    },
  });
})(ClimbingApp.views.BaseListView);
