define(['app'],
function(app) {
  var baseView = function ClimbingApp$BaseView() {

  }

  baseView.prototype = {
    date2Object: function ClimbingApp$BaseView$Date2Object(date) {
      if (date) {
        return new Date(date);
      } else {
        return new Date();
      }
    },

    object2Date: function ClimbingApp$BaseView$Object2Date(dateObj) {
      if (dateObj) {
        return dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
      } else {
        return '';
      }
    },
  }

  return baseView;
});
