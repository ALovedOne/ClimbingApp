define(['app'], function(app) {
  var serviceParams = ['$http', 'ClimbingApp$BaseAddr', 'GymResource', 'WallResource', 'RouteResource'];
  var serviceFn = function ClimbingApp$GymService($http, baseAddr, GymResource, WallResource, RouteResource) {
    console.log("FullGymService initialize");
    this.$http = $http;
    this.baseAddr = baseAddr;
    this.GymResource = GymResource;
    this.WallResource = WallResource;
    this.RouteResource = RouteResource;
    this.resAddr  = baseAddr + '/api/v1/full_gym/';
  }

  serviceFn.prototype = {

    $find: function ClimbingApp$GymService$Find(params) {
      return this.$http.get(this.resAddr).then(function (data) {
        return data.data.objects.map(this.__makeObjFromJson);
      }.bind(this));
    },

    $get: function ClimbingApp$GymService$Get(gymID) {
      return this.$http.get(this.resAddr + gymID + '/').then(function(data) {
        return this.__makeObjFromJson(data.data);
      }.bind(this));
    },

    $save: function ClimbingApp$GymService$Save(gym) {
      if (gym.resource_uri) {
        return this.$http.put(this.baseAddr + gym.resource_uri, gym).then(function(data) {
          return this.__makeObjFromJson(data.data); 
        }.bind(this));
      } else {
        return this.$http.post(this.resAddr, gym).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      }
    },

    __makeObjFromJson(jsonObj) {
      var wallArray = jsonObj.walls.sort(function(a, b) {
        if (a.sort_name == b.sort_name) {
          return 0;
        } else if (a.sort_name < b.sort_name) {
          return -1;
        } else {
          return 1;
        }
      });

      wallArray.forEach(function(wall) {
        wall.routeList = jsonObj.routes.filter(function(route) {
          return route.wall == wall.resource_uri;
        }.bind(this)).map(function(route) {
          return this.RouteResource.__makeObjFromJson(route);
        }.bind(this)); 
      }.bind(this));

      return {
        gym: this.GymResource.__makeObjFromJson(jsonObj.gym),
        walls: wallArray
      };
    },
  };

  app.service('FullGymResource', serviceParams.concat([serviceFn]));
  return serviceFn;
});
