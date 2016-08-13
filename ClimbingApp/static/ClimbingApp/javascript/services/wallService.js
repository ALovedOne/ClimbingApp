define(['app', 'utils'], function(app, utils) {
  var serviceParams = ['AuthenticatedHttp', 'ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$RouteResource($http, baseAddr) {
    this.$http = $http;
    this.baseAddr = baseAddr;
    this.resAddr = baseAddr + '/api/v1/walls/';
  };

  serviceFn.prototype = { 
    $find: function ClimbingApp$WallService$Find(params) {
      return this.$http.get(this.resAddr, { params: params}).then(function(data) {
        return data.data.objects.map(this.__makeObjFromJson.bind(this));
      }.bind(this));
    },

    $get: function ClimbingApp$WallService$Get(wallId) {
      return this.$http.get(this.resAddr + wallId + '/').then(function(data) {
        return this.__makeObjFromJson(data.data);
      }.bind(this));
    },

    $save: function ClimbingApp$WallService$Save(wall) {
      if (wall.resource_uri) {
        return this.$http.put(this.baseAddr + wall.resource_uri, wall).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      } else {
        return this.$http.post(this.resAddr, wall).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      }
    },

    $delete: function ClimbingApp$WallService$Delete(wall) {

    },

    $create: function ClimbingApp$WallService$Create() {
      return this.__makeNewObj();
    },

    __makeObjFromJson: function ClimbingApp$WallService$__makeObjFromJson(jsonObj) {
      return {
        id: jsonObj.id,
        resource_uri: jsonObj.resource_uri,
        name:         jsonObj.name,
        sort_name:    jsonObj.sort_name,
        gym_uri:      jsonObj.gym,
      }
    },

    __makeNewObj() {
      return {
        id: undefined,
        resource_uri: undefined,
        name: '',
        sort_name: '',
        gym_uri: undefined,
      };
    },
  };

  app.service('WallResource', serviceParams.concat([serviceFn]));
  return serviceFn;
})
