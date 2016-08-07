define(['app'], function(app) {
  var serviceParams = ['$http', 'ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$ColorService($http, baseAddr) {
    console.log("ColorService initialize");
    this.$http = $http;
    this.baseAddr = baseAddr;
    this.resAddr  = baseAddr + '/api/v1/colors/';
  }

  serviceFn.prototype = {

    $find: function ClimbingApp$ColorService$Find(params) {
      return this.$http.get(this.resAddr).then(function (data) {
        return data.data.objects.map(this.__makeObjFromJson);
      }.bind(this));
    },

    $get: function ClimbingApp$ColorService$Get(colorID) {
      return this.$http.get(this.resAddr + colorID + '/').then(function(data) {
        return this.__makeObjFromJson(data.data);
      }.bind(this));
    },

    $save: function ClimbingApp$ColorService$Save(color) {
      if (color.resource_uri) {
        return this.$http.put(this.baseAddr + color.resource_uri, color).then(function(data) {
          return this.__makeObjFromJson(data.data); 
        }.bind(this));
      } else {
        return this.$http.post(this.resAddr, color).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      }
    },

    $delete: function ClimbingApp$ColorService$Delete(color) {
      return this.$http.delete(this.baseAddr + color.resource_uri).then(function(data) {
        return data;
      });
    },

    $create: function ClimbingApp$ColorService$Create() {
      return this.__makeNewObj();
    },

    __makeObjFromJson(jsonObj) {
      return { 
        id:           jsonObj.id,
        name:         jsonObj.name,
        inner_r:      jsonObj.inner_r,
        inner_g:      jsonObj.inner_g,
        inner_b:      jsonObj.inner_b,
        resource_uri: jsonObj.resource_uri,
        image:        jsonObj.image,
      };
    },

    __makeNewObj() {
      return {
        id: undefined,
        name: '',
        inner_r: 0,
        inner_g: 0,
        inner_b: 0,
        resource_uri: undefined,
        image: '',
      };
    },
  };

  app.service('ColorResource', serviceParams.concat([serviceFn]));
  return serviceFn;
});
