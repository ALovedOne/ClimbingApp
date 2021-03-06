'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.services = ClimbingApp.services || {};

ClimbingApp.services.RouteService = (function(baseService){
  var serviceFn = function ClimbingApp$RouteResource() {
  };

  serviceFn.prototype = { 
    get ResourceAddress() { return '/api/v1/routes/'; },    
    get BaseModel() { return null; },

    __makeJsonFromObj: function ClimbingApp$RouteService$__makeJsonFromObj(obj) {
      return {
        id: obj.id,
        resource_uri: obj.resource_uri,
        removeDate:   utils.obj2Date(obj.removeDate),
        setDate:      utils.obj2Date(obj.setDate),
        wall:         obj.wall.resource_uri,
        color:        obj.color.resource_uri,
        difficulty:   obj.difficulty.resource_uri
      }
    },

    __makeObjFromJson: function ClimbingApp$RouteService$__makeObjFromJson(jsonObj) {
      return {
        id: jsonObj.id,
        resource_uri: jsonObj.resource_uri,
        removeDate:   utils.date2Obj(jsonObj.removeDate),
        setDate:      utils.date2Obj(jsonObj.setDate),
        wall_uri:     jsonObj.wall,

        color:      this.ColorResource.__makeObjFromJson(jsonObj.color),
        difficulty: this.DifficultyResource.__makeObjFromJson(jsonObj.difficulty)
      }
    },

    __makeNewObj() {
      return {
        id: undefined,
        removeDate: null,
        setDate: null,
        wall_uri: undefined,

        color_uri: undefined,
        color: null,

        difficulty_uri: undefined,
        difficulty: null,
      };
    },
  };

  serviceFn.$inject = ['ColorResource', 'DifficultyResource'];

  myApp.service('RouteResource', ClimbingApp.utils.extendClass(serviceFn, baseService));
})(ClimbingApp.services.BaseService);
