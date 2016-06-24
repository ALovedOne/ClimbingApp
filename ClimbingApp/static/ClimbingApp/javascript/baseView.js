define(['app'],
function(app) {
  'option explicit';

  var baseView = function ClimbingApp$BaseView(argsNames, args) {
    console.assert(argsNames, "Must pass the controller param names");
    console.assert(argsNames.indexOf('$scope') >= 0, '$scope must be included');

    var idx;

    for (idx = 0; idx < argsNames.length; idx++) {
      var argName = argsNames[idx];
      this[argName] = args[idx];
    }
  }

  baseView.prototype = {
    date2Object: function ClimbingApp$BaseView$Date2Object(date, allowNull) {
      if (date) {
        return new Date(date);
      } else if (allowNull) {
        return null;
      } else {
        return new Date();
      }
    },

    object2Date: function ClimbingApp$BaseView$Object2Date(dateObj) {
      if (dateObj) {
        return dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
      } else {
        return null;
      }
    },
  }

  return baseView;
});
