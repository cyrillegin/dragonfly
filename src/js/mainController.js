import 'eonasdan-bootstrap-datetimepicker';
import './../css/bootstrap-datetimepicker.min.css';

require('./../../node_modules/bootstrap-switch/dist/js/bootstrap-switch.min.js');
require('./../../node_modules/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css');

export default class mainController {
    constructor($scope, $timeout, $http) {
        'ngInject';

        this.$scope = $scope;
        this.$http = $http;

        $scope.graphIndex = 0;

        $http.get('api/camera').then(
            (success) => {
                $scope.fishcam = '/images/fishcam/image_' + success.data + '.jpg';
            },
            (error) => {
                console.log('error');
                console.log(error);
            },
        );

        $(() => {
            $('#side-bar-button').on('click', () => {
                $('#side-bar').toggleClass('side-bar-open');
                $('#side-bar-button').toggleClass('side-bar-button-open');
                $('#side-bar-button-icon').toggleClass('glyphicon-chevron-right');
                $('#side-bar-button-icon').toggleClass('glyphicon-chevron-left');
                $('#main-container').toggleClass('main-container-open');
            })
        })
        this.GetData();
    }

    GetData() {
        this.$http.get('/api/sensor').then(
            (success) => {
                this.$scope.lightSwitchCharts = [];
                success.data.sensor_list.forEach((i) => {
                    if (i.self_type === 'lightswitch') {
                        this.DrawLightSwitch(i);
                    }
                });
                this.$scope.lightSwitchCharts.forEach((lightSwitch) => {
                    $(() => {
                        $('#' + lightSwitch.id).bootstrapSwitch();
                        $('#' + lightSwitch.id).bootstrapSwitch('state', lightSwitch.val);
                    });
                });
            },
            (error) => {
                console.log('error');
                console.log(error);
            },
        );
    }

    DrawLightSwitch(data) {
        const switchObj = {
            title: data.name,
            id: 'switch-' + data.name.split(' ').join(''),
            val: data.lastReading,
        };
        this.$scope.lightSwitchCharts.push(switchObj);
    }
}
