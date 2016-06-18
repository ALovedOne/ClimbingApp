define(['app', 'baseView'],
function(app, baseView) {
  'option explicit';

  var baseListView = function ClimbingApp$BaseListView(argsNames, args) {
    console.assert(argsNames, "Must pass the controller param names");
    console.assert(argsNames.indexOf('$scope') >= 0, '$scope must be included');

    baseView.call(this, argsNames, args);
  };

  baseListView.prototype = Object.create(baseView.prototype);

  return baseListView;
});
