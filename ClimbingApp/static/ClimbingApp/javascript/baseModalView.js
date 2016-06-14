define(['app', 'baseView'],
function(app, baseView) {
  'option explicit';

  var baseModalView = function ClimbingApp$BaseModalView(argsNames, args) {
    console.assert(argsNames, "Must pass the controller param names");
    console.assert(argsNames.indexOf('$scope') >= 0, '$scope must be included');

    baseView.call(this, argsNames, args);

    this.$scope.$on('$stateChangeStart', function($event, toState, toStateArgs, fromState, fromStateArgs) {
      $event.preventDefault();
    });
  };

  baseModalView.prototype = Object.create(baseView.prototype);

  return baseModalView;
});
