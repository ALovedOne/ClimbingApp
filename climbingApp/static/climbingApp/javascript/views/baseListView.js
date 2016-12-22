'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.views = ClimbingApp.views || {};

ClimbingApp.views.BaseListView = (function(baseView) {

  var baseListView = function ClimbingApp$BaseListView() {
  };

  baseListView.prototype = Object.create(baseView.prototype);
  
  return ClimbingApp.utils.extendCtrl(baseListView, baseView);
})(ClimbingApp.views.BaseView);
