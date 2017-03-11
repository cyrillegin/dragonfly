'use strict';

angular.module('dragonfly.graphcontroller', ['googlechart'])

.controller("graphController",['$scope', '$timeout', '$http', '$window', 'apiService', function ($scope, $timeout, $http, $window, apiService) {
    $scope.$watch('sensors', function(v){
        if(v !== undefined){
            for(var i in $scope.data){
                if($scope.data[i].readings.length < 3) continue;
                  DrawLineChart($scope.data[i]);
              }
}
});

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


}]);