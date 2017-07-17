import angular from 'angular';
import angularRoute from 'angular-route'; // eslint-disable-line
import 'bootstrap';
import '../css/style.css';
import 'bootstrap/dist/css/bootstrap.css';

import graphController from './graphWidget.js';
import gaugeController from './gaugeWidget.js';
import mainController from './mainController.js';
import sensorController from './sensorInfo.js';
import treeController from './treeWidget.js';

// Declare app level module which depends on views, and components
angular.module('dragonfly', ['ngRoute'])
    .controller('mainController', mainController)
    .controller('gaugeController', gaugeController)
    .controller('treeController', treeController)
    .controller('graphController', graphController)
    .controller('sensorController', sensorController)
    .config(['$routeProvider', ($routeProvider) => {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/base.html',
            })
            .otherwise({
                redirectTo: '/',
            });
    }]);
