'use strict';

angular.module('dragonfly.maincontroller', ['googlechart'])

.controller("mainController",['$scope', '$timeout', '$http', '$window', 'apiService', function ($scope, $timeout, $http, $window, apiService) {

    var switchids = []
    $scope.graphIndex = 0;

    function GetData(){
      var req = {
        method: 'GET',
        url: 'dragonfly/getReadings',
        data: {}
      };
      $http(req).then(function successCallback(response){
        var info = response.data
        $scope.sensors = info;
        $scope.lightSwitchCharts = [];
        $scope.tempCharts = [];
        $scope.graphs = [];
        $scope.data = response.data;
        for(var i in info){
          if(info[i].self_type === "lightswitch"){
            DrawLightSwitch(info[i]);
          } else {
              // DrawTempChart(info[i]);
          }
          if(info[i].readings.length < 3) continue;
          // DrawLineChart(info[i]);
        }
      }, function errorCallback(response){
        console.log("An error has occured.", response.data);
      }).then(function(){
        $timeout(function(){
          for(var i in switchids){
            PostLoad();
          }
        }, 500);
      });
    }

    function PostLoad(){

      //bootstrap switches
      for(var i in switchids){
        $('#'+switchids[i]).bootstrapSwitch();
        $('#'+switchids[i]).on('switchChange.bootstrapSwitch', function(event, state){
          var req = {
            method: 'POST',
            url: "dragonfly/sendData",
            data: {
                "lightswitch": event.target.id.split('-')[1],
                "value": state
            }
          };

          $http(req).then(function successCallback(response){
            console.log("we got a good response!");
            console.log(response);
          }), function errorCallback(response){
             console.log("An error has occured.", response.data);
          };
        });
      }

      //clean chart drawings
      for(var i in $scope.cleanCharts){
        var cx = document.querySelector("#"+$scope.cleanCharts[i].id).getContext("2d");
        cx.beginPath();
        cx.moveTo(35, 0);
        cx.lineTo(35, 50);

        cx.lineTo(0, 100);
        cx.lineTo(5, 110);
        cx.lineTo(95, 110);
        cx.lineTo(100,100);

        cx.lineTo(65, 50);
        cx.lineTo(65, 0);
        
        // cx.fillStyle = "rgb(68, 191, 255)" //use this to change the color
        cx.fill();
      }
    }

//Buttons
    $scope.SelectSensor = function(id){
      var j = 0;
      for(var i in $scope.sensors){

        if($scope.sensors[i].name === id[0]){
          console.log("sensor found")
          console.log(j)
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

//Utility

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
//Chart drawing
    
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
