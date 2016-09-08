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

    obj2Date: function ClimbingApp$Utils$Obj2Date(dateObj) {
      if (dateObj) {
        return dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
      } else {
        return null;
      }
    },
  }
});
