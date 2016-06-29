define(['app'], function(app) {
  var serviceParams = ['$http', 'ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$GymService($http, baseAddr) {
    console.log("GymService initialize");
    this.$http = $http;
    this.baseAddr = baseAddr;
    this.resAddr  = baseAddr + '/api/v1/gyms/';
  }

  serviceFn.prototype = {

    $find: function ClimbingApp$GymService$Find(params) {
      return this.$http.get(this.resAddr).then(function (data) {
        return data.data.objects.map(this.__makeObjFromJson);
      }.bind(this));
    },

    $get: function ClimbingApp$GymService$Get(gymID) {
      return this.$http.get(this.resAddr + gymID + '/').then(function(data) {
        return this.__makeObjFromJson(data.data);
      }.bind(this));
    },

    $save: function ClimbingApp$GymService$Save(gym) {
      if (gym.resource_uri) {
        return this.$http.put(this.baseAddr + gym.resource_uri, gym).then(function(data) {
          return this.__makeObjFromJson(data.data); 
        }.bind(this));
      } else {
        return this.$http.post(this.resAddr, gym).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      }
    },

    $delete: function ClimbingApp$GymService$Delete(gym) {
      return this.$http.delete(this.baseAddr + gym.resource_uri).then(function(data) {
        return data;
      });
    },

    $create: function ClimbingApp$GymService$Create() {
      return this.__makeNewObj();
    },

    __makeObjFromJson(jsonObj) {
      return { 
        id:           jsonObj.id,
        name:         jsonObj.name,
        sort:         jsonObj.sort,
        resource_uri: jsonObj.resource_uri,

      };
    },

    __makeNewObj() {
      return {
        id: undefined,
        name: '',
        sort: '',
        resource_uri: undefined
      };
    },
  };

  app.service('GymResource', serviceParams.concat([serviceFn]));
  return serviceFn;
});
