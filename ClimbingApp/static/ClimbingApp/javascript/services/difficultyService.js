define(['app'], function(app) {
  var serviceParams = ['AuthenticatedHttp', 'ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$DifficultyService($http, baseAddr) {
    console.log("DifficultyService initialize");
    this.$http = $http;
    this.baseAddr = baseAddr;
    this.resAddr  = baseAddr + '/api/v1/difficulties/';
  }

  serviceFn.prototype = {

    $find: function ClimbingApp$DifficultyService$Find(params) {
      return this.$http.get(this.resAddr).then(function (data) {
        return data.data.objects.map(this.__makeObjFromJson);
      }.bind(this));
    },

    $get: function ClimbingApp$DifficultyService$Get(difficultyID) {
      return this.$http.get(this.resAddr + difficultyID + '/').then(function(data) {
        return this.__makeObjFromJson(data.data);
      }.bind(this));
    },

    $save: function ClimbingApp$DifficultyService$Save(difficulty) {
      if (difficulty.resource_uri) {
        return this.$http.put(this.baseAddr + difficulty.resource_uri, difficulty).then(function(data) {
          return this.__makeObjFromJson(data.data); 
        }.bind(this));
      } else {
        return this.$http.post(this.resAddr, difficulty).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      }
    },

    $delete: function ClimbingApp$DifficultyService$Delete(difficulty) {
      return this.$http.delete(this.baseAddr + difficulty.resource_uri).then(function(data) {
        return data;
      });
    },

    $create: function ClimbingApp$DifficultyService$Create() {
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

  app.service('DifficultyResource', serviceParams.concat([serviceFn]));
  return serviceFn;
});
