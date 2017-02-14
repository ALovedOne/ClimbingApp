'use strict';

var ClimbingApp = ClimbingApp || {};
ClimbingApp.services = ClimbingApp.services || {};

ClimbingApp.services.BaseService = (function() {
  var baseService = function ClimbingApp$BaseService() {
    this._resAddr = this.ClimbingApp$BaseAddr + this.ResourceAddress;
    this._baseModel = this.BaseModel;
    this._baseAddr = this.ClimbingApp$BaseAddr;
  };
  
  baseService.prototype = {
    get ResourceAddress() { 
      console.error("Sublcass must implement ResourceAddress() property"); 
      return "";
    },

    get BaseModel() {
      console.error("Sublcass must implement BaseModel() property");
      return null;
    },

    $find: function ClimbingApp$BaseService$Find(params) {
      return this.AuthenticatedHttp.get(this._resAddr, { params: params}).then(function(data) {
        return data.data.objects.map(this.__makeObjFromJson.bind(this));
      }.bind(this));
    },
  
    $findAll: function ClimbingApp$BaseServices$FindAll(params) {
      return this.$find(params);
    },
  
    $get: function ClimbingApp$BaseService$Get(objId) {
      return this.AuthenticatedHttp.get(this._resAddr + objId + '/').then(function(data) {
        return this.__makeObjFromJson(data.data);
      }.bind(this));
    },
  
    $save: function ClimbingApp$BaseService$Save(obj) {
      var jsonObj = this.__makeJsonFromObj(obj);
      if (obj.resource_uri) {
        return this.AuthenticatedHttp.put(this._baseAddr + obj.resource_uri, jsonObj).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      } else {
        return this.AuthenticatedHttp.post(this._resAddr, jsonObj).then(function(data) {
          return this.__makeObjFromJson(data.data);
        }.bind(this));
      }
    },
  
    $delete: function ClimbingApp$BaseService$Delete(obj) {
      if (obj.resource_uri) {
        return this.AuthenticatedHttp.delete(this._baseAddr + obj.resource_uri).then(function(data) {
          return data;
        });
      } else {
        // Tried to delete an object which doesn't exist on the server
      }
    },
  
    $create: function ClimbingApp$BaseService$Create() {
      return this.__makeNewObj();
    },

    copy: function ClimbingApp$BaseService$Copy(object) {
      return this.__makeObjFromJson(this.__makeJsonFromObj(object));
    },
  }

  baseService.$inject = ['AuthenticatedHttp', 'ClimbingApp$BaseAddr'];

  return baseService;
})();
