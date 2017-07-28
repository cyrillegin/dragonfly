import angular from 'angular';
import angularRoute from 'angular-route'; // eslint-disable-line
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
// import graphcomponent from './components/graph/graph.component';
// import gaugecomponent from './components/gauge/gauge.component';
// import sensorcomponent from './components/sensor/sensor.component';
// import treecomponent from './components/tree/tree.component';
import basePage from './pages/base.html';

// Declare app level module which depends on views, and components
angular.module('dragonfly', ['ngRoute'])
    // .component('gaugecomponent', gaugecomponent)
    // .component('treecomponent', treecomponent)
    // .component('graphController', graphcomponent)
    // .component('sensorcomponent', sensorcomponent)
    .config(['$routeProvider', ($routeProvider) => {
        $routeProvider
            .when('/', {
                templateUrl: basePage,
            })
            .otherwise({
                redirectTo: '/',
            });
    }]);
