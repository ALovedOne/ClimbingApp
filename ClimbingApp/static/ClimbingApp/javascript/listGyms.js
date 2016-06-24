define(['app', 'baseListView'],
function(app, baseView) {
  'use strict';

  var controllerParams = ['$scope', '$state', '$mdDialog', 'GymResource', 'UserGymStatsResource'];
  var controllerFn = function($scope, $state, $mdDialog, GymResource, GymStatsResource) {
    baseView.call(this, controllerParams, arguments);

    GymResource.objects.$find().then(function(gyms) {
      this.gymList = gyms.objects;
    }.bind(this));
  }

  controllerFn.prototype = Object.create(baseView.prototype);

  controllerFn.prototype.editGymPriv = function ClimbingApp$listGyms$editGym($event, gym) {
    var childScope = this.$scope.$new();
    childScope.gym = gym;
    
    childScope.acceptDialog = function($event) {
      gym.save().then(function(newGym) {
        $mdDialog.hide(newGym)
      });
    }
 
    childScope.cancelDialog = function($event) {
      $mdDialog.cancel(false);
    }
    
    return this.$mdDialog.show({
      templateUrl: '/static/ClimbingApp/partials/editGym.html',
      controller: 'ClimbingAppEditGym',
      controllerAs: 'ctrl',
      locals: {
        gym: gym,
      },
      targetEvent: $event,
      scope: childScope,
      onRemoving: function() {
        childScope.$destroy();
      }
    });
  }

  controllerFn.prototype.addGym = function ClimbingApp$listGyms$addGym($event) {
    $event.originalEvent.cancelBubble = true;
    this.editGymPriv($event, this.GymResource.objects.$create()).then(function(newGym) {
      this.gymList.push(newGym);
    }.bind(this));
  }

  controllerFn.prototype.deleteGym = function ClimbingApp$listGyms$deleteGym($event, gym) {
    $event.originalEvent.cancelBubble = true;
    var confirm = this.$mdDialog.confirm()
      .title("Delete this Gym?")
      .targetEvent($event)
      .ok("Delete it")
      .cancel("Don't do it");

    this.$mdDialog.show(confirm).then(function() {
      gym.$delete().then(function() {
        this.gymList = _.without(this.gymList, gym);
      }.bind(this));
    }.bind(this));
  }

  var controller = controllerParams.concat([controllerFn]);
  app.controller('ClimbingAppListGyms', controller);
  return controller;
});

    /*
    $scope.options = {
      chart: {
        type: 'stackedAreaChart',

        //showControls: false,
        //showLegend: false,
        //showXAxis: false,
        //showYAxis: false,

        color: function(d, i) {
          if(d.key == 1) {
            return 'red';
          } else if (d.key == 2) { 
            return 'blue';
          } else if (d.key == 3) {
            return 'green';
          }
          return 'yellow';
        },

        height: 450,
        margin : {
          top: 20,
          right: 20,
          bottom: 30,
          left: 40
        },
        x: function(d){
          return new Date(d.date).getTime();
        },
        y: function(d){
          return d.id__count;
        },
        useVoronoi: false,
        clipEdge: true,
        duration: 100,
        useInteractiveGuideline: true,
        xAxis: {
          showMaxMin: false,
          tickFormat: function(d) {
            return d3.time.format('%x')(new Date(d))
          }
        },
        yAxis: {
          tickFormat: function(d){
            return d3.format(',.2f')(d);
          }
        },
        zoom: {
          enabled: false,
          scaleExtent: [1, 10],
          useFixedDomain: false,
          useNiceScale: false,
          horizontalOff: false,
          verticalOff: true,
          unzoomEventType: 'dblclick.zoom'
        }
      }
    };

    $scope.data = [
      {
        "key" : "North America" ,
        "values" : [ [ 1025409600000 , 23.041422681023] , [ 1028088000000 , 19.854291255832] ],
      },
      {
        "key" : "Africa" ,
        "values" : [ [ 1025409600000 , 7.9356392949025] , [ 1028088000000 , 7.4514668527298] ],
      },
      {
        "key" : "South America" ,
        "values" : [ [ 1025409600000 , 7.9149900245423] , [ 1028088000000 , 7.0899888751059] ],
      },
      {
        "key" : "Asia" ,
        "values" : [ [ 1025409600000 , 13.153938631352] , [ 1028088000000 , 12.456410521864] ],
      } ,
      {
        "key" : "Europe" ,
        "values" : [ [ 1025409600000 , 9.3433263069351] , [ 1028088000000 , 8.4583069475546] ],
      } ,
      {
        "key" : "Australia" ,
        "values" : [ [ 1025409600000 , 5.1162447683392] , [ 1028088000000 , 4.2022848306513] ],
      } ,
      {
        "key" : "Antarctica" ,
        "values" : [ [ 1025409600000 , 1.3503144674343] , [ 1028088000000 , 1.2232741112434] ],
      }
    ]
    */

    /*
    GymStatsResource.objects.$get({id: 2}).then(function(data) {
      var sortedData = {};
      var datesArry = [];
      data.data.forEach(function(outcomeObj) {
        var outcomeKey = outcomeObj.key;
        outcomeObj.values.forEach(function(valueObj) {
          var date = new Date(valueObj.date);
          if (!sortedData[date]) {
            sortedData[date] = {}
            sortedData[date].date = date;
            datesArry.push(date);
          }
          sortedData[date][outcomeKey] = valueObj;
        });
      });

      var x = datesArry.sort(function(a, b) {
        var aTime = a.getTime();
        var bTime = b.getTime();

        if (aTime == bTime) { return 0; }
        if (aTime < bTime)  { return 1; }
        if (aTime > bTime)  { return -1; }
      });

      var x = x.map(function(date) {
        return sortedData[date];
      });

      console.log(x);
      $scope.data = x;
    });
    */
