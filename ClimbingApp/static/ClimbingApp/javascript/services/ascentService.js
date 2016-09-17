'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.services = ClimbingApp.services || {};

ClimbingApp.services.AscentService = (function(baseService){
  var serviceParams = ['AuthenticatedHttp', 'ClimbingApp$BaseAddr', 'OutcomeResource', 'UserResource'];
  var serviceFn = function ClimbingApp$AscentService($http, baseAddr, OutcomeService, UserService) {
    baseService.call(this, serviceParams, arguments);

    this.$http = $http;
    this.baseAddr = baseAddr;
    this.resAddr = baseAddr + '/api/v1/ascents/';
  };

  serviceFn.prototype = { 
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
  angular.extend(serviceFn.prototype, baseService.prototype);

  myApp.service('AscentResource', serviceParams.concat([serviceFn]));
  return serviceFn;
})(ClimbingApp.services.BaseService);
