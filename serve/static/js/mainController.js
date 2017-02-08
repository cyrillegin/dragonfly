'use strict';

angular.module('dragonfly.maincontroller', [])

.controller('mainController', ['$scope', function($scope){
    function init(){
        console.log("hello angular");
    }
    init();
}]);