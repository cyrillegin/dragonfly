'use strict';

angular.module('dragonfly.maincontroller', [])

.controller("mainController",['$scope', '$timeout', '$http', 'apiService', 'dataService', function ($scope, $timeout, $http, apiService, dataService) {

  var switchids = []
  $scope.graphIndex = 0;

  function GetData(){
    var req = {
      method: 'GET',
      url: '/api/sensor',
      data: {}
    };
    $http(req).then(function successCallback(response){
      $scope.lightSwitchCharts = [];
      dataService.set(response.data.sensor_list);
      for(var i in response.data.sensor_list){
        if(response.data.sensor_list[i].self_type === "lightswitch"){
          DrawLightSwitch(response.data.sensor_list[i]);
        }
      }
    }, function errorCallback(response){
      console.log("An error has occured.", response.data);
    }).then(function(){
      //initialize bootstrap switches
      $timeout(function(){
        for(var i in switchids){
          $('#'+switchids[i]).bootstrapSwitch();
          $('#'+switchids[i]).bootstrapSwitch('state', $scope.lightSwitchCharts[i].val);
          $('#'+switchids[i]).on('switchChange.bootstrapSwitch', function(event, state){
            SendData(
              '/api/command', {
                "lightswitch": event.target.id.split('-')[1],
                'value': state
              }
            )
          });
        }
      }, 500);
    });
  }

  $scope.SubmitSensor = function(){
    var params = {
      "name": $scope.newSensorName,
      "description": $scope.newSensorDesc,
      "coefficients": $scope.newSensorType,
      "sensor_type": $scope.newSensorUnits,
      "units": $scope.newSensorCoef
    }
    if(params.name === "" || params.name === undefined){
      console.log("warning");
      return;
    }
    SendData('api/sensor', params, GetData)
  };

  $scope.SubmitReading = function(){
    var params = {
      "value": $scope.newReadingValue,
      "date": $scope.newReadingDate,
      "sensor": dataService.change().selection
    }
    if(params.value === "" || params.value === undefined || params.date === "" || params.date === undefined){
      console.log("warning");
      return;
    }
    SendData('api/reading', params, GetData) 
  }

  $scope.SubmitLog = function(){
    var params = {
      "title": $scope.newLogTitle,
      "description": $scope.newLogDesc
    }
    if(params.title === "" || params.title === undefined || params.description === "" || params.description === undefined){
      console.log("warning");
      return;
    }
    SendData('api/log', params, GetData) 
  }

  function SendData(newurl, params, callback){
    var req = {
      method: 'POST',
      url: newurl,
      data: params
    };

    $http(req).then(function successCallback(response){
      if(callback){
        callback();
      }
    }), function errorCallback(response){
       console.log("An error has occured.", response.data);
    };
  }
  
  function DrawLightSwitch(data){
    var switchObj = {
      "title": data.name,
      "id": "switch-"+data.id,
      'val': data.lastReading
    }
    $scope.lightSwitchCharts.push(switchObj);
    switchids.push("switch-"+data.id);
  }
  GetData();
}]);
