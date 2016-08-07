define(['app'], function(app) {
  'use strict';

  app.value('AnonymousUser', {
    name: "Anonymous"
  });
  
  function addColorToHex(color) {
    color.hexValue = function() {
      return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    };

    color.contrastColorHexValue = function() {
      var r = this.r * 0.299;
      var g = this.g * 0.587;
      var b = this.b * 0.114;
            
      return (r + g + b) > 104? "black": "white";
    };
  }
});
