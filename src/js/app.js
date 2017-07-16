import angular from 'angular';
import angularRoute from 'angular-route'; // eslint-disable-line

import graphController from './graphWidget.js';
import gaugeController from './gaugeWidget.js';
import mainController from './mainController.js';
import sensorController from './sensorInfo.js';
import dataService from './services.js';
import apiService from './services.js';
import treeController from './treeWidget.js';

import 'bootstrap'


// Declare app level module which depends on views, and components
angular.module('dragonfly', ['ngRoute'])
    .controller('mainController', mainController)
    .controller('gaugeController', gaugeController)
    .controller('treeController', treeController)
    .controller('graphController', graphController)
    .controller('sensorController', sensorController)
    .service('dataService', dataService)
    .service('apiService', apiService)
    .config(['$routeProvider', ($routeProvider) => {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/base.html',
            })
            .otherwise({
                redirectTo: '/',
            });
    }]);
