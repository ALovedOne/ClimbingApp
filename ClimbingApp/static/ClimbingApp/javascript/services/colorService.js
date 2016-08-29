define(['angular', 'app', 'services/baseService'], function(angular, app, baseService) {
  var serviceParams = ['AuthenticatedHttp', 'ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$ColorService($http, baseAddr) {
    baseService.call(this, serviceParams, arguments);

    this.$http = $http;
    this.baseAddr = baseAddr;
    this.resAddr  = baseAddr + '/api/v1/colors/';
  }

  serviceFn.prototype = {

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

  angular.extend(serviceFn.prototype, baseService.prototype);

  app.service('ColorResource', serviceParams.concat([serviceFn]));
  return serviceFn;
});
