define(['app'], function(app) {
  var serviceParams = ['$http', 'ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$RouteResource($http, baseAddr) {
    this.$http = $http;
    this.baseAddr = baseAddr;
    this.resAddr = baseAddr + '/api/v1/routes';
  };

  serviceFn.prototype = { 
    $find: function ClimbingApp$RouteService$Find(params) {

    },

    $get: function ClimbingApp$RouteService$Get(gymId) {

    },

    $save: function ClimbingApp$RouteService$Save(gym) {

    },

    $delete: function ClimbingApp$GymService$Delete(gym) {

    },

    $create: function ClimbingApp$RouteService$Create() {
      return this.__makeNewObj();
    },

    __makeObjFromJson(jsonObj) {

    },

    __makeNewObj() {
      return {
        id: undefined,
        removeDate: null,
        setDate: null,
        wall_uri: undefined,

        color_uri: undefined,
        color: {
          id: undefined,
          image: '',
          name: '',
          resource_uri: undefined,
        },

        difficulty_uri: undefined,
        difficulty: {
          id: undefined,
          name: '',
          resource_uri: undefined,
          sort_name: '',
        },
      };
    },
  };

  app.service('RouteResource2', serviceParams.concat([serviceFn]));
  return serviceFn;
})
