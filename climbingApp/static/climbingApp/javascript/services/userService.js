'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.services = ClimbingApp.services || {};

ClimbingApp.services.UserService = (function(baseService){
  var serviceFn = function ClimbingApp$UserService() {
  }
  
  serviceFn.prototype = {
    get ResourceAddress() { return '/api/v1/users/'; },
    get BaseModel() { return null; },
  
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
  
  serviceFn.$inject = [];
  
  myApp.service('UserResource', ClimbingApp.utils.extendClass(serviceFn, baseService));
})(ClimbingApp.services.BaseService);
