define(['angular', 'app', 'utils', 'services/baseService'], 
function(angular, app, utils, baseService) {
  var serviceParams = ['AuthenticatedHttp', 'ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$AscentService($http, baseAddr) {
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

    __makeObjFromJson: function ClimbingApp$AscentService$__makeObjFromJson(jsonObj) {
      return {
        id: jsonObj.id,
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

  app.service('AscentResource', serviceParams.concat([serviceFn]));
  return serviceFn;
})
