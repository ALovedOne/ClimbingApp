define(['app', 'utils'], function(app, utils) {
  var serviceParams = ['AuthenticatedHttp', 'ClimbingApp$BaseAddr'];
  var serviceFn = function ClimbingApp$RouteResource($http, baseAddr) {
    this.$http = $http;
    this.baseAddr = baseAddr;
    this.resAddr = baseAddr + '/api/v1/ascents/';
  };

  serviceFn.prototype = { 
    $find: function ClimbingApp$RouteService$Find(params) {
      return this.$http.get(this.resAddr, { params: params}).then(function(data) {
        return data.data.objects.map(this.__makeObjFromJson.bind(this));
      }.bind(this));
    },

    $get: function ClimbingApp$RouteService$Get(ascentId) {
      return this.$http.get(this.resAddr + ascentId + '/').then(function(data) {
        return this.__makeObjFromJson(data.data);
      }.bind(this));
    },

    $save: function ClimbingApp$RouteService$Save(ascent) {
      if (ascent.resource_uri) {
        return this.$http.put(this.baseAddr + ascent.resource_uri, ascent).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      } else {
        return this.$http.post(this.resAddr, ascent).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      }
    },

    $delete: function ClimbingApp$RouteService$Delete(ascent) {

    },

    $create: function ClimbingApp$RouteService$Create() {
      return this.__makeNewObj();
    },

    OutcomeResource: {
      __makeObjFromJson: function(jsonObj) {
        return jsonObj;
      },
    },

    UserResource: {
      __makeObjFromJson: function(jsonObj) {
        return jsonObj;
      },
    },

    __makeObjFromJson: function ClimbingApp$RouteService$__makeObjFromJson(jsonObj) {
      return {
        id: jsonObj.id,
        resource_uri: jsonObj.resource_uri,
        date:         utils.date2Obj(jsonObj.date),
        outcome:      this.OutcomeResource.__makeObjFromJson(jsonObj.outcome),
        route_uri:    jsonObj.route.resource_uri,
        user:         this.UserResource.__makeObjFromJson(jsonObj.user),
        comment:      this.comment,
        /*
        removeDate: this.__jsonDate2Obj(jsonObj.removeDate),
        setDate:    this.__jsonDate2Obj(jsonObj.setDate),
        wall_uri:     jsonObj.wall,
        */
      }
    },

    __makeNewObj() {
      return {
        id: undefined,
        removeDate: null,
        setDate: null,
        wall_uri: undefined,

        color_uri: undefined,
        color: null,

        difficulty_uri: undefined,
        difficulty: null,
      };
    },
  };

  app.service('AscentResource', serviceParams.concat([serviceFn]));
  return serviceFn;
})
