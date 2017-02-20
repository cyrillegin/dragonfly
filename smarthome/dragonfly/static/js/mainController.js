'use strict';

angular.module('dragonfly.maincontroller', ['googlechart'])

.controller("mainController",['$scope', 'apiService', function ($scope, apiService) {

    function DrawChart(data){
        var myChartObject = {};  

        myChartObject.type = "LineChart";

        myChartObject.data = [
          ['Time', 'Value']
        ]

        for(var i in data.readings){
          myChartObject.data.push([new Date(data.readings[i].created), data.readings[i].value])
        }

        myChartObject.options = {
            displayAnnotations: true
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
          if(info[i].readings.length < 5) continue;
          DrawChart(info[i]);
        }
      }), function(error){
        console.log("we erred: " + error)
      }
    }
    GetData();
   
}]);
