import angular from 'angular';
import angularRoute from 'angular-route'; // eslint-disable-line
import graphcomponent from './components/graph/graph.component';
import gaugeController from './components/gauge/gauge.controller';
import sensorcomponent from './components/sensor/sensor.component';
import treecomponent from './components/tree/tree.component';
import baseController from './components/base/base.controller';
import basePage from './components/base/base.html';
import 'angular-material'; // eslint-disable-line

require ('./../node_modules/angular-material/angular-material.min.css');

// Declare app level module which depends on views, and components
angular.module('dragonfly', ['ngRoute', 'ngMaterial'])
    .controller('gaugeController', gaugeController)
    // .component('treecomponent', treecomponent)
    // .component('graphcomponent', graphcomponent)
    // .component('sensorcomponent', sensorcomponent)
    .controller('baseController', baseController)
    .config(
        ['$routeProvider', ($routeProvider) => {
            $routeProvider
                .when('/', {
                    template: basePage,
                })
                .otherwise({
                    redirectTo: '/',
                });
        }]);
