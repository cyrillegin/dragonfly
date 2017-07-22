import 'eonasdan-bootstrap-datetimepicker';
import './../css/bootstrap-datetimepicker.min.css';

require('./../../node_modules/bootstrap-switch/dist/js/bootstrap-switch.min.js');

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
        this.GetData();
    }

    DrawLightSwitch(data) {
        const switchObj = {
            title: data.name,
            id: 'switch-' + data.name.split(' ').join(''),
            val: data.lastReading,
        };
        this.$scope.lightSwitchCharts.push(switchObj);
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
            },
            (error) => {
                console.log('error');
                console.log(error);
            },
        ).then(() => {
            this.$scope.lightSwitchCharts.forEach((lightSwitch) => {
                $('#' + lightSwitch.id).bootstrapSwitch();
                $('#' + lightSwitch.id).bootstrapSwitch('state', lightSwitch.val);
            });
        });
    }
}
