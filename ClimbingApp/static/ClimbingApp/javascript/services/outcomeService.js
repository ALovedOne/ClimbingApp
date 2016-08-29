define(['angular', 'app', 'utils', 'services/baseService'],
function(angular, app, utils, baseService) {
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

  angular.extend(serviceFn.prototype, baseService.prototype);

  app.service('OutcomeResource', serviceParams.concat([serviceFn]));
  return serviceFn;
});
