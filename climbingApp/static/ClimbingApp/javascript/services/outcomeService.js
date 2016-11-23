'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.services = ClimbingApp.services || {};

ClimbingApp.services.UserService = (function(baseService){
  var serviceParams = ['AuthenticatedHttp', 'ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$OutcomeService($http, baseAddr) {
    baseService.call(this, serviceParams, arguments);

    this.$http = $http;
    this.baseAddr = baseAddr;
    this.resAddr  = baseAddr + '/api/v1/ascent_outcomes/';
  }

  serviceFn.prototype = {

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

  angular.extend(serviceFn.prototype, baseService.prototype);

  myApp.service('OutcomeResource', serviceParams.concat([serviceFn]));
  return serviceFn;
})(ClimbingApp.services.BaseService);