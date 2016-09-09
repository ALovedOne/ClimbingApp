define(['angular', 'app', 'utils', 'services/baseService'], 
function(angular, app, utils, baseService) {
  var serviceParams = ['AuthenticatedHttp', 'ClimbingApp$BaseAddr', 'DifficultyResource', 'ColorResource'];
  var serviceFn = function ClimbingApp$RouteResource($http, baseAddr, DifficultyResource, ColorResource) {
    baseService.call(this, serviceParams, arguments);

    this.$http = $http;
    this.baseAddr = baseAddr;
    this.resAddr = baseAddr + '/api/v1/routes/';
  };

  serviceFn.prototype = { 
    

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

  angular.extend(serviceFn.prototype, baseService.prototype);

  app.service('RouteResource', serviceParams.concat([serviceFn]));
  return serviceFn;
})
