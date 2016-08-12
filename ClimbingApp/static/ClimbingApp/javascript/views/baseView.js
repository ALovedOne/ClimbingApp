define(
function() {
  'option explicit';

  var baseView = function ClimbingApp$BaseView(argsNames, args) {
    console.assert(argsNames, "Must pass the controller param names");
    console.assert(argsNames.indexOf('$scope') >= 0, '$scope must be included');

    var idx;

    for (idx = 0; idx < argsNames.length; idx++) {
      var argName = argsNames[idx];
      this[argName] = args[idx];
    }
  };

  baseView.prototype = {
  }

  return baseView;
});
