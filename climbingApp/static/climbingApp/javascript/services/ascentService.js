'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.services = ClimbingApp.services || {};

ClimbingApp.services.AscentService = (function(baseService){
  var serviceParams = ['AuthenticatedHttp', 'ClimbingApp$BaseAddr', 'OutcomeResource', 'UserResource'];
  var serviceFn = function ClimbingApp$AscentService() {
  };

  serviceFn.prototype = { 
    get ResourceAddress() { return '/api/v1/ascents/'; },
    get BaseModel() { return null; },

    OutcomeResource: {
      __makeObjFromJson: function(jsonObj) {
        return jsonObj;
      },
    },

    UserResource: {
      __makeObjFromJson: function(jsonObj) {
        return jsonObj;
      },
    },

    __makeJsonFromObj: function ClimbingApp$AscentService$__makeJsonFromObj(obj) {
      return {
        id:           obj.id,
        resource_uri: obj.resource_uri,
        date:         utils.obj2Date(obj.date),
        outcome:      obj.outcome.resource_uri,
        route:        obj.route.resource_uri,
        user:         obj.user.resource_uri,
        comment:      obj.comment
      }
    },

    __makeObjFromJson: function ClimbingApp$AscentService$__makeObjFromJson(jsonObj) {
      return {
        id:           jsonObj.id,
        resource_uri: jsonObj.resource_uri,
        date:         utils.date2Obj(jsonObj.date),
        outcome:      this.OutcomeResource.__makeObjFromJson(jsonObj.outcome),
        route_uri:    jsonObj.route.resource_uri,
        user:         this.UserResource.__makeObjFromJson(jsonObj.user),
        comment:      this.comment,
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
  serviceFn.$inject = [];

  myApp.service('AscentResource', ClimbingApp.utils.extendClass(serviceFn, baseService));
  return serviceFn;
})(ClimbingApp.services.BaseService);
