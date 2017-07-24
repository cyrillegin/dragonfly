import angular from 'angular';
import angularRoute from 'angular-route'; // eslint-disable-line
import 'bootstrap';
import '../css/style.css';
import 'bootstrap/dist/css/bootstrap.css';

import graphController from './graphWidget';
import gaugeController from './gaugeWidget';
import mainController from './mainController';
import sensorController from './sensorInfo';
import treeController from './treeWidget';

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
