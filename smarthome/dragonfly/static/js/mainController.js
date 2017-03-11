'use strict';

angular.module('dragonfly.maincontroller', [])

.controller("mainController",['$scope', '$timeout', '$http', 'apiService', function ($scope, $timeout, $http, apiService) {

  var switchids = []
  $scope.graphIndex = 0;

  function GetData(){
    var req = {
      method: 'GET',
      url: 'dragonfly/getReadings',
      data: {}
    };
    $http(req).then(function successCallback(response){
      $scope.lightSwitchCharts = [];
      $scope.data = response.data;
      for(var i in response.data){
        if(response.data[i].self_type === "lightswitch"){
          DrawLightSwitch(response.data[i]);
        }
      }
    }, function errorCallback(response){
      console.log("An error has occured.", response.data);
    }).then(function(){
      //initialize bootstrap switches
      $timeout(function(){
        for(var i in switchids){
          $('#'+switchids[i]).bootstrapSwitch();
          $('#'+switchids[i]).on('switchChange.bootstrapSwitch', function(event){
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

  $scope.SelectSensor = function(id){
    var j = 0;
    for(var i in $scope.sensors){
      if($scope.sensors[i].name === id[0]){
        $scope.graphIndex = j;
        $scope.selectedSensor = $scope.sensors[i];
      }
      j++;
    }
  };

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
      "sensor": $scope.selectedSensor.name
    }
    if(params.value === "" || params.value === undefined || params.date === "" || params.date === undefined){
      console.log("warning");
      return;
    }
    SendData('dragonfly/addReading', params, GetData) 
  }

  function SendData(newurl, params, callback){
    var req = {
      method: 'POST',
      url: newurl,
      data: params
    };

    $http(req).then(function successCallback(response){
      console.log("we got a good response!");
      console.log(response);
      callback();
    }), function errorCallback(response){
       console.log("An error has occured.", response.data);
    };
  }
  
  function DrawLightSwitch(data){
    var switchObj = {
      "title": data.name,
      "id": "switch-"+data.id
    }
    $scope.lightSwitchCharts.push(switchObj);
    switchids.push("switch-"+data.id);
  }
  GetData();
}]);
