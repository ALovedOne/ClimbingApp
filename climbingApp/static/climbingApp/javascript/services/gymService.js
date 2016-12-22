'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.services = ClimbingApp.services || {};

ClimbingApp.services.GymService = (function(baseService){
  var serviceParams = ['AuthenticatedHttp', 'ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$GymService($http, baseAddr) {
    baseService.call(this, serviceParams, arguments);

    this.$http = $http;
    this.baseAddr = baseAddr;
    this.resAddr  = baseAddr + '/api/v1/gyms/';
  }

  serviceFn.prototype = {

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

  angular.extend(serviceFn.prototype, baseService.prototype);

  myApp.service('GymResource', serviceParams.concat([serviceFn]));
})(ClimbingApp.services.BaseService);
