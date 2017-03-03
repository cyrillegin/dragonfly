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

    $scope.ShowDetails = function(){
      if($scope.showdetails){
        $scope.showdetails = false;
        $('#detailsBtn').text("Show Details");
      } else {
        $scope.showdetails = true;
        $('#detailsBtn').text("Hide Details");
      }
    }
    $scope.ShowDetails();

    function GetData(){
      apiService.get('sensors').then(function(response){
        var info = response.data.results
        console.log(info);
        for(var i in info){
          switch(info[i].sensor_type){
            case "temperature": 
              DrawTempChart(info[i]);
              break;
            case "cleanliness":
            DrawTempChart(info[i]);
              // DrawCleanChart(info[i]);
              break;
            case "lightsensor":
              // DrawLightSenseChart(info[i]);
              DrawTempChart(info[i]);
              break;
            case "lightswitch":
              DrawLightSwitch(info[i]);
              break;
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

          cs()
          var req = {
            method: 'POST',
            url: "dragonfly/sendData",
            csrf_token: cs(),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'

            },
            params: {
                "lightswitch": event.target.id.split('-')[1],
                "value": state
            }
          };

          console.log(req);

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

        for(var i in data.readings){
          
          var vals = data.coefficients.split(",")
          var coef = {
            'x': parseInt(vals[0][1]),
            'y': parseInt(vals[1][0])
          }
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
