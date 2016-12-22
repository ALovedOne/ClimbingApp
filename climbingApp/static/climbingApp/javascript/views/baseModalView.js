'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.views = ClimbingApp.views || {};

ClimbingApp.views.BaseModalView = (function(baseView) {

  var baseModalView = function ClimbingApp$BaseModalView() {

    this.$scope.$on('$stateChangeStart', function($event, toState, toStateArgs, fromState, fromStateArgs) {
      $event.preventDefault();
    });
  };

  baseModalView.prototype = Object.create(baseView.prototype);
 
  baseModalView.$inject = ['$rootScope'];

  return ClimbingApp.utils.extendCtrl(baseModalView, baseView);
})(ClimbingApp.views.BaseView);
