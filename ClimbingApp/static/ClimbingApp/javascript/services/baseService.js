define(
function() {
  'option explicit';

  var baseService = function ClimbingApp$BaseService(argsNames, args) {
    var idx;
    for(idx = 0; idx < argsNames.length; idx++) {
      var argName = argsNames[idx];
      this[argName] = args[idx];
    }
  };

  baseService.prototype = {
    $find: function ClimbingApp$RouteService$Find(params) {
      return this.$http.get(this.resAddr, { params: params}).then(function(data) {
        return data.data.objects.map(this.__makeObjFromJson.bind(this));
      }.bind(this));
    },

    $findAll: function ClimbingApp$RouteServices$FindAll(params) {
      return this.$find(params);
    },

    $get: function ClimbingApp$RouteService$Get(routeId) {
      return this.$http.get(this.resAddr + routeId + '/').then(function(data) {
        return this.__makeObjFromJson(data.data);
      }.bind(this));
    },

    $save: function ClimbingApp$RouteService$Save(route) {
      if (route.resource_uri) {
        return this.$http.put(this.baseAddr + route.resource_uri, route).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      } else {
        return this.$http.post(this.resAddr, route).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      }
    },

    $delete: function ClimbingApp$RouteService$Delete(route) {

    },

    $create: function ClimbingApp$RouteService$Create() {
      return this.__makeNewObj();
    },
  }

  return baseService;
});
