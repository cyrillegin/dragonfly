'use strict';

angular.module('dragonfly.maincontroller', [])

.controller("mainController",['$scope', '$timeout', '$http', 'apiService', 'dataService', function ($scope, $timeout, $http, apiService, dataService) {

  var switchids = []
  $scope.graphIndex = 0;

  function GetData(){
    var req = {
      method: 'GET',
      url: 'dragonfly/getSensors',
      data: {}
    };
    $http(req).then(function successCallback(response){
      console.log(response)
      $scope.lightSwitchCharts = [];
      dataService.set(response.data.sensors);
      for(var i in response.data.sensors){
        if(response.data.sensors[i].self_type === "lightswitch"){
          DrawLightSwitch(response.data.sensors[i]);
        }
      }
    }, function errorCallback(response){
      console.log("An error has occured.", response.data);
    }).then(function(){
      //initialize bootstrap switches
      $timeout(function(){
        for(var i in switchids){
          $('#'+switchids[i]).bootstrapSwitch();
          console.log($scope.lightSwitchCharts[i])
          $('#'+switchids[i]).bootstrapSwitch('state', $scope.lightSwitchCharts[i].val);
          $('#'+switchids[i]).on('switchChange.bootstrapSwitch', function(event, state){
            SendData(
              'dragonfly/sendData', {
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
    SendData('dragonfly/addSensor', params, GetData)
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
    SendData('dragonfly/addReading', params, GetData) 
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
    SendData('dragonfly/addLog', params, GetData) 
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
    console.log(data);
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
