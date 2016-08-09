define(['app'], function(app) {
  var serviceParams = ['AuthenticatedHttp', 'ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$UserService($http, baseAddr) {
    console.log("UserService initialize");
    this.$http = $http;
    this.baseAddr = baseAddr;
    this.resAddr  = baseAddr + '/api/v1/users/';
  }

  serviceFn.prototype = {

    $find: function ClimbingApp$UserService$Find(params) {
      return this.$http.get(this.resAddr).then(function (data) {
        return data.data.objects.map(this.__makeObjFromJson);
      }.bind(this));
    },

    $get: function ClimbingApp$UserService$Get(userID) {
      return this.$http.get(this.resAddr + userID + '/').then(function(data) {
        return this.__makeObjFromJson(data.data);
      }.bind(this));
    },

    $save: function ClimbingApp$UserService$Save(user) {
      if (user.resource_uri) {
        return this.$http.put(this.baseAddr + user.resource_uri, user).then(function(data) {
          return this.__makeObjFromJson(data.data); 
        }.bind(this));
      } else {
        return this.$http.post(this.resAddr, user).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      }
    },

    $delete: function ClimbingApp$UserService$Delete(user) {
      return this.$http.delete(this.baseAddr + user.resource_uri).then(function(data) {
        return data;
      });
    },

    $create: function ClimbingApp$UserService$Create() {
      return this.__makeNewObj();
    },

    __makeObjFromJson(jsonObj) {
      return { 
        id:           jsonObj.id,
        username:     jsonObj.username,
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

  app.service('UserResource', serviceParams.concat([serviceFn]));
  return serviceFn;
});
