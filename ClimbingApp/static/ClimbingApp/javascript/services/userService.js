define(['angular', 'app', 'utils', 'services/baseService'],
function(angular, app, utils, baseService) {
  var serviceParams = ['AuthenticatedHttp', 'ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$UserService($http, baseAddr) {
    baseService.call(this, serviceParams, arguments);

    this.$http = $http;
    this.baseAddr = baseAddr;
    this.resAddr  = baseAddr + '/api/v1/users/';
  }

  serviceFn.prototype = {

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

  angular.extend(serviceFn.prototype, baseService.prototype);

  app.service('UserResource', serviceParams.concat([serviceFn]));
  return serviceFn;
});
