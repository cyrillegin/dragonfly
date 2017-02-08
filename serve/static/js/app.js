
'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('dragonfly', [
  'ngRoute',
  'dragonfly.maincontroller'
])

.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
    $routeProvider.otherwise({redirectTo: '/'});
    $routeProvider.when('/', {
        templateUrl: 'base.html',
        reloadOnSearch: false
    });
}]);
