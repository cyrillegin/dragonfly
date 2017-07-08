/*jslint node: true */
'use strict';

// Declare app level module which depends on views, and components
const app = angular.module('dragonfly', [ // jshint ignore:line
        'ngRoute',
        'dragonfly.maincontroller',
        'dragonfly.gaugecontroller',
        'dragonfly.treecontroller',
        'dragonfly.graphcontroller',
        'dragonfly.sensorcontroller',
        'dragonfly.services',
    ])

    .config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) { // jshint ignore:line
        $routeProvider.when('/', {
            templateUrl: '/templates/base.html',
            reloadOnSearch: false,
        });
    }, ]);
