'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.services = ClimbingApp.services || {};

ClimbingApp.services.UserService = (function(baseService){
  var serviceFn = function ClimbingApp$OutcomeService() {
  }

  serviceFn.prototype = {
    get ResourceAddress() { return '/api/v1/ascent_outcomes/'; },
    get BaseModel() { return null; },

    __makeObjFromJson(jsonObj) {
      return { 
        id:           jsonObj.id,
        resource_uri: jsonObj.resource_uri,
        name:         jsonObj.name,
        sort:         jsonObj.sort,
        image:        jsonObj.image,
      };
    },

    __makeNewObj() {
      return {
        id: undefined,
        name: '',
        sort: '',
        resource_uri: undefined,
      };
    },
  };

  serviceFn.$inject = [];

  myApp.service('OutcomeResource', ClimbingApp.utils.extendClass(serviceFn, baseService));
  return serviceFn;
})(ClimbingApp.services.BaseService);
