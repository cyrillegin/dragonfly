/*jslint node: true */
'use strict';

angular.module('dragonfly.sensorcontroller', [])

.controller("sensorController", ['$scope', 'dataService', '$window', 'apiService', '$timeout', '$location', '$http', function($scope, dataService, $window, apiService, $timeout, $location, $http) {
  var data;
  var selection;

  $scope.$watch(function() {
      return dataService.selection();
  }, function(v) {
      if (v === undefined) return;
      selection = v;
      LoadValues();
  });

  $scope.$watch(function() {
      return dataService.data();
  }, function(v) {
      if (v === undefined) return;
      data = v;
      LoadValues();
  });

  function LoadValues(){
    if(!data || !selection) return;
    for(var i in data){
      if(data[i].name === selection){
        console.log(data[i]);
        $scope.sensorName = selection;
        $scope.sensorDescription = data[i].description;
        $scope.sensorCoefficients = data[i].coefficients;
        $scope.sensorType = data[i].self_type;
        $scope.sensorUnits = data[i].units;
        $scope.sensorMinValue = data[i].min_value;
        $scope.sensorMaxValue = data[i].max_value;
        $scope.sensorStation = data[i].station;
      }
    }
  }

  $scope.SaveSensor = function(){
    console.log('here')
    data = {
      'name': $scope.sensorName,
      'description': $scope.sensorDescription,
      'coefficients': $scope.sensorCoefficients,
      'self_type': $scope.sensorType,
      'units': $scope.sensorUnits,
      'min_value': $scope.sensorMinValue,
      'max_value': $scope.sensorMaxValue,
      'station': $scope.sensorStation
    }

    apiService.post('sensor', data).then(function successCallback(response) {
        $('#message').html('Sensor update successfully.')
        $('#message').toggleClass('alert alert-success')
    }, function errorCallback(response) {
        console.log("An error has occured.");
        console.log(response)
        $('#message').html('Oops! Something went wrong.')
        $('#message').toggleClass('alert alert-danger')

    });
    console.log(data)
  }



}]);
