'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.services = ClimbingApp.services || {};

ClimbingApp.services.UserService = (function(baseService){
  var serviceFn = function ClimbingApp$ColorService() {
  }

  serviceFn.prototype = {
    get ResourceAddress() { return '/api/v1/colors/'; },
    get BaseModel() { return null; },

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

  serviceFn.$inject = [];

  myApp.service('ColorResource', ClimbingApp.utils.extendClass(serviceFn, baseService));
})(ClimbingApp.services.BaseService);
