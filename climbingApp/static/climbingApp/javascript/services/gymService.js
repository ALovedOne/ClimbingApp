'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.services = ClimbingApp.services || {};

ClimbingApp.services.GymService = (function(baseService){
  var serviceFn = function ClimbingApp$GymService() {
  }

  serviceFn.prototype = {
    get ResourceAddress() { return '/api/v1/gyms/'; },
    get BaseModel() { return null; },

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

    __makeJsonFromObj(obj) {
      return {
        id:           obj.id,
        name:         obj.name,
        sort:         obj.sort,
        resource_uri: obj.resource_uri,
      };
    },
  };

  serviceFn.$inject = [];

  myApp.service('GymResource', ClimbingApp.utils.extendClass(serviceFn, baseService));
})(ClimbingApp.services.BaseService);
