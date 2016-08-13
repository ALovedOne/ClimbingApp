define([], 
function() {
  'use strict';

  return {
    date2Obj: function ClimbingApp$Utils$Date2Obj(date) {
      if (date) {
        return new Date(date);
      } else {
        return null;
      }
    },

    object2Date: function ClimbingApp$Utils$Obj2Date(dateObj) {
      return dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
    },
  }
});
