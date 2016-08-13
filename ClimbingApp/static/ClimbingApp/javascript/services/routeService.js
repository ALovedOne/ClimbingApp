define(['app', 'utils'], function(app, utils) {
  var serviceParams = ['AuthenticatedHttp', 'ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$RouteResource($http, baseAddr) {
    this.$http = $http;
    this.baseAddr = baseAddr;
    this.resAddr = baseAddr + '/api/v1/routes/';
  };

  serviceFn.prototype = { 
    $find: function ClimbingApp$RouteService$Find(params) {
      return this.$http.get(this.resAddr, { params: params}).then(function(data) {
        return data.data.objects.map(this.__makeObjFromJson.bind(this));
      }.bind(this));
    },

    $get: function ClimbingApp$RouteService$Get(routeId) {
      return this.$http.get(this.resAddr + routeId + '/').then(function(data) {
        return this.__makeObjFromJson(data.data);
      }.bind(this));
    },

    $save: function ClimbingApp$RouteService$Save(route) {
      if (route.resource_uri) {
        return this.$http.put(this.baseAddr + route.resource_uri, route).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      } else {
        return this.$http.post(this.resAddr, route).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      }
    },

    $delete: function ClimbingApp$RouteService$Delete(route) {

    },

    $create: function ClimbingApp$RouteService$Create() {
      return this.__makeNewObj();
    },

    ColorResource: {
      __makeObjFromJson: function (jsonObj) {
        return jsonObj;
      },
    },

    DifficultyResource: {
      __makeObjFromJson: function(jsonObj) {
        return jsonObj;
      },
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

  app.service('RouteResource', serviceParams.concat([serviceFn]));
  return serviceFn;
})
