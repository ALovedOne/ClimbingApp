define(['app'], function(app) {
  var serviceParams = ['AuthenticatedHttp', 'ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$OutcomeService($http, baseAddr) {
    console.log("OutcomeService initialize");
    this.$http = $http;
    this.baseAddr = baseAddr;
    this.resAddr  = baseAddr + '/api/v1/ascent_outcomes/';
  }

  serviceFn.prototype = {

    $find: function ClimbingApp$OutcomeService$Find(params) {
      return this.$http.get(this.resAddr).then(function (data) {
        return data.data.objects.map(this.__makeObjFromJson);
      }.bind(this));
    },

    $get: function ClimbingApp$OutcomeService$Get(outcomeID) {
      return this.$http.get(this.resAddr + outcomeID + '/').then(function(data) {
        return this.__makeObjFromJson(data.data);
      }.bind(this));
    },

    $save: function ClimbingApp$OutcomeService$Save(outcome) {
      if (outcome.resource_uri) {
        return this.$http.put(this.baseAddr + outcome.resource_uri, outcome).then(function(data) {
          return this.__makeObjFromJson(data.data); 
        }.bind(this));
      } else {
        return this.$http.post(this.resAddr, outcome).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      }
    },

    $delete: function ClimbingApp$OutcomeService$Delete(outcome) {
      return this.$http.delete(this.baseAddr + outcome.resource_uri).then(function(data) {
        return data;
      });
    },

    $create: function ClimbingApp$OutcomeService$Create() {
      return this.__makeNewObj();
    },

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

  app.service('OutcomeResource', serviceParams.concat([serviceFn]));
  return serviceFn;
});
