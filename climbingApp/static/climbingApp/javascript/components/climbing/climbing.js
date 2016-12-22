'use strict';
(function(baseView) {
  var climbingParams = ['$scope', '$mdDialog', 'AscentResource'];
  var climbingCtrl = function ClimbingApp$Climbing() {
    this.ascentList = [];

    this.filters = { gym: this.gym.id }
    this.loadAscents(this.filters);
  }

  climbingCtrl.prototype = {
    loadAscents: function ClimbingApp$Climbing$loadAscents(filters) {
      this.AscentResource.$find(this.filters).then(function(ascents) {
        this.ascentList = ascents;
      }.bind(this));
    },

    changeFilter: function (filter, value) {
      if (filter == "today") {
        if (value) {
          this.filters['date'] = utils.obj2Date(new Date());
        } else {
          delete this.filters['date'];
        } 
      } else {
        this.filters[filter] = value;
      }
      this.loadAscents(this.filters);
    },

    addAscent: function ClimbingApp$climbing$addAscent($event) {
      $event.cancelBubble = true;

      var newAscent = this.AscentResource.objects.$create();
      newAscent.route = null;
      newAscent.user = this.user;

      this.editAscentPopUp(newAscent, $event).then(function(newAscent) {
        this.ascentList.push(newAscent);
      }.bind(this));
    },
    
    editAscentPopUp: function editAscentPopUp(ascent, $event) {
      var childScope = this.$scope.$new();
      return this.$mdDialog.show({
        templateUrl: '/static/ClimbingApp/partials/editAscent.html',
        locals: {
          ascent: ascent,
          route: null,
          wall: null,
          gym: this.gym
        },
        controller: 'ClimbingAppEditAscent',
        controllerAs: 'editAscent',
        targetEvent: $event,
        scope: childScope,
        onRemoving: function() {
          childScope.$destroy();
        }
      });
    },
  }

  climbingCtrl.$inject = climbingParams;
  angular.module('ClimbingApp').component('climbing', {
    templateUrl: '/static/climbingApp/javascript/components/climbing/climbing.html',
    controller:  ClimbingApp.utils.extendCtrl(climbingCtrl, baseView),
    bindings: {
      gym: '<',
      user: '<',
    },
  });
})(ClimbingApp.views.BaseListView);
