/*jslint node: true */
'use strict';
var angular, $;
angular.module('dragonfly.maincontroller', [])

.controller("mainController",['$scope', '$timeout', 'apiService', 'dataService', '$window', function ($scope, $timeout, apiService, dataService, $window) {

  var switchids = [];
  $scope.graphIndex = 0;

  function GetFishImage(){
    apiService.get('camera').then(function successCallback(response){
      $scope.fishcam = 'images/fishcam/image_'+response.data+'.jpg';
      console.log(response)
    });
  }
  $timeout(function(){
  GetFishImage();
})

  function GetData(){
    apiService.get('sensor').then(function successCallback(response){ 
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
          if($scope.lightSwitchCharts[i] === undefined) continue;
          $('#'+switchids[i]).bootstrapSwitch();
          $('#'+switchids[i]).bootstrapSwitch('state', $scope.lightSwitchCharts[i].val);
          // $('#'+switchids[i]).on('switchChange.bootstrapSwitch', function(event, state){
            // SendData(
            //   '/api/command', {
            //     "lightswitch": event.target.id.split('-')[1],
            //     'value': state
            // });
          // });
        }
      }, 500);
    });
  }
  
  function DrawLightSwitch(data){
    var switchObj = {
      "title": data.name,
      "id": "switch-"+data.name,
      'val': data.lastReading
    };
    $scope.lightSwitchCharts.push(switchObj);
    switchids.push(switchObj.id);
  }
  GetData();
}]);
