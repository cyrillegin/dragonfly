'use strict';

angular.module('dragonfly.maincontroller', ['googlechart'])

.controller("mainController", function ($scope) {

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
    DrawChart();
});
