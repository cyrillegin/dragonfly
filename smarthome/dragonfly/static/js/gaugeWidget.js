'use strict';

angular.module('dragonfly.gaugecontroller', [])

.controller("gaugeController",['$scope', function ($scope) {

  $scope.tempCharts = [];
  $scope.$watch('data', function(v){
      if(v !== undefined){
          console.log($scope.data)
          for(var i in $scope.data){
              console.log("here")
              DrawTempChart($scope.data[i]);
          }
      }
  });

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
}]);