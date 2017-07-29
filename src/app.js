import angular from 'angular';
import angularRoute from 'angular-route'; // eslint-disable-line
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import graphcomponent from './components/graph/graph.component';
import gaugecomponent from './components/gauge/gauge.component';
import sensorcomponent from './components/sensor/sensor.component';
import treecomponent from './components/tree/tree.component';
import baseController from './components/base/base.controller';
import basePage from './components/base/base.html';


// Declare app level module which depends on views, and components
angular.module('dragonfly', ['ngRoute'])
    .component('gaugecomponent', gaugecomponent)
    .component('treecomponent', treecomponent)
    .component('graphcomponent', graphcomponent)
    .component('sensorcomponent', sensorcomponent)
    .controller('baseController', baseController)
    .config(['$routeProvider', ($routeProvider) => {
        $routeProvider
            .when('/', {
                template: basePage,
            })
            .otherwise({
                redirectTo: '/',
            });
    }]);
