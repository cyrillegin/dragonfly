'use strict';

angular.module('dragonfly.maincontroller', ['googlechart'])

.controller("mainController",['$scope', '$timeout', '$http', 'apiService', function ($scope, $timeout, $http, apiService) {

    $scope.showdetails = false;

    $scope.graphs = [];
    $scope.tempCharts = [];
    $scope.cleanCharts = [];
    $scope.lightSensorCharts = [];
    $scope.lightSwitchCharts = [];

    var switchids = []

    function GetData(){
      apiService.get('sensors').then(function(response){
        var info = response.data.results
        console.log(info);
        $scope.sensors = info;
        for(var i in info){
          if(info[i].sensor_type === "lightswitch"){
            DrawLightSwitch(info[i]);
          } else {
              DrawTempChart(info[i]);
          }
          if(info[i].readings.length < 3) continue;
          DrawLineChart(info[i]);
        }
      }).then(function(){
        $timeout(function(){
          for(var i in switchids){
            PostLoad();
            
          }
        }, 500);
      }), function(error){
        console.log("we erred: " + error)
      }
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

    $scope.ReadingEntry = false;
    $scope.SensorEntry = false;

//Buttons
    $scope.AddSensor = function(){
      console.log("adding a sensor")
      $scope.ReadingEntry = false;
      $scope.SensorEntry = true;
    };

    $scope.SelectSensor = function(id){
      console.log(id);
      $scope.ReadingEntry = true;
      $scope.SensorEntry = false;
      for(var i in $scope.sensors){
        if($scope.sensors[i].name === id[0]){
          console.log("sensor found")
          $scope.selectedSensor = $scope.sensors[i];
        }
      }
    };

    $scope.SubmitSensor = function(){
      console.log("submitting sensor");
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
      SendData('dragonfly/addSensor', params)  

    };

    $scope.SubmitReading = function(){
      console.log("submitting reading");
      var params = {
          "value": $scope.newReadingValue,
          "date": $scope.newReadingDate,
          "sensor": $scope.selectedSensor.name
      }
      if(params.value === "" || params.value === undefined || params.date === "" || params.date === undefined){
        console.log("warning");
        return;
      }
      SendData('dragonfly/addReading', params) 
    }

//Utility

function SendData(newurl, params){
  var req = {
    method: 'POST',
    url: newurl,
    data: params
  };

  $http(req).then(function successCallback(response){
    console.log("we got a good response!");
    console.log(response);
  }), function errorCallback(response){
     console.log("An error has occured.", response.data);
  };
}
//Chart drawing
    function DrawCleanChart(data){
      var cleanObj = {
        "title": data.name,
        "id": "clean-" + data.id,
        "reading": data.readings[data.readings.length-1].value.toFixed(3)
      }
      $scope.cleanCharts.push(cleanObj);
    }

    function DrawLightSenseChart(data){
      var myObj = {
        "title": data.name,
        "id": "light-"+data.id,
        "reading": data.readings[data.readings.length-1].value.toFixed(3)
      }
      $scope.lightSensorCharts.push(myObj);
    }

    function DrawLightSwitch(data){
      var switchObj = {
        "title": data.name,
        "id": "switch-"+data.id
      }
      $scope.lightSwitchCharts.push(switchObj);
      switchids.push("switch-"+data.id);
    }

    function DrawTempChart(data){
      if(data.readings[data.readings.length-1] === undefined) return;
      var myChartObject = {}; 
      myChartObject.type = "Gauge"
      myChartObject.data = [
          ['Label', 'Value'],
          [data.name, data.readings[data.readings.length-1].value]
      ];

      myChartObject.options = {
          width: 400, height: 120,
          yellowFrom: 0, yellowTo: 55, yellowColor: '#4286f4',
          greenFrom: 55, greenTo: 80, greenColor: '#0cff2d',
          redFrom: 80, redTo: 120, redColor: '#ff0c0c',
          minorTicks: 5
      };

      $scope.tempCharts.push(myChartObject)
    }
   
   function DrawLineChart(data){
        var myChartObject = {};  

        myChartObject.type = "LineChart";

        myChartObject.data = [
          ['Time', 'Value']
        ]

        var vals = data.coefficients.split(",")
        var coef = {'x':1, 'y':0}
        // var coef = {
        //   'x': parseInt(vals[0][1]),
        //   'y': parseInt(vals[1][0])
        // }

        for(var i in data.readings){
          var value = data.readings[i].value * coef.x + coef.y; 
          myChartObject.data.push([new Date(data.readings[i].created), value])
        }

        myChartObject.options = {
            displayAnnotations: true,
            'title': data.name
        };

        $scope.graphs.push(myChartObject)
    }

    function svgDraw(){
      
    }

    GetData();

}]);
