'use strict';

angular.module('dragonfly.maincontroller', ['googlechart'])

.controller("mainController",['$scope', 'apiService', function ($scope, apiService) {

    $scope.showdetails = false;

    $scope.ShowDetails = function(){
      if($scope.showdetails){
        $scope.showdetails = false;
        $('#detailsBtn').text("Show Details");
      } else {
        $scope.showdetails = true;
        $('#detailsBtn').text("Hide Details");
      }
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

        $scope.charts.push(myChartObject)
    }

    function DrawTempChart(data){
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


        $scope.charts.push(myChartObject)
    }

    function GetData(){
      apiService.get('sensors').then(function(response){
        var info = response.data.results
        console.log("we got: ");
        console.log(info);
        $scope.charts = [];
        for(var i in info){
          if(info[i].readings.length < 3) continue;
          // if(info[i].type === "temp"){
            DrawTempChart(info[i]);
          // }
          // if(info[i].type === "line"){
            DrawLineChart(info[i]);
          // }
        }
      }), function(error){
        console.log("we erred: " + error)
      }
    }
    GetData();
   
}]);
