'use strict';

angular.module('dragonfly.maincontroller', ['googlechart'])

.controller("mainController",['$scope', 'apiService', function ($scope, apiService) {

    function DrawChart(){
        $scope.myChartObject = {};  

        $scope.myChartObject.type = "LineChart";

        $scope.myChartObject.data = [
          ['Year', 'Sales', 'Expenses'],
          ['2004',  1000,      400],
          ['2005',  1170,      460],
          ['2006',  660,       1120],
          ['2007',  1030,      540]
        ]

        $scope.myChartObject.options = {
            displayAnnotations: true
        };
    }

    function GetData(){
      apiService.get('sensors').then(function(response){
        var info = response.data.results
        console.log("we got: ");
        console.log(info);
      }), function(error){
        console.log("we erred: " + error)
      }
    }
    GetData();
    DrawChart();
}]);
