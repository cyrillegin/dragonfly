import 'eonasdan-bootstrap-datetimepicker';
import './../css/bootstrap-datetimepicker.min.css';

export default class mainController {
    constructor($scope, $timeout, $http) {

        'ngInject';
        $scope.graphIndex = 0;

        $timeout(() => {
            $http.get('api/camera').then((response) => {
                $scope.fishcam = '/images/fishcam/image_' + response.data + '.jpg';
            });
        });

        function DrawLightSwitch(data) {
            const switchObj = {
                title: data.name,
                id: 'switch-' + data.name.split(' ').join(''),
                val: data.lastReading,
            };
            $scope.lightSwitchCharts.push(switchObj);
        }

        function GetData() {
            $http.get('/api/sensor').then((response) => {
                $scope.lightSwitchCharts = [];
                // dataService.set(response.data.sensor_list);
                response.data.sensor_list.forEach((i) => {
                    if (i.self_type === 'lightswitch') {
                        DrawLightSwitch(i);
                    }
                });
            }, (response) => {
                console.log('An error has occured.', response.data);
            }).then(() => {
                $(() => {
                    // initialize bootstrap switches
                    $timeout(() => {
                        $scope.lightSwitchCharts.forEach((lightSwitch) => {
                            console.log('here');
                            // $('#' + lightSwitch.id).bootstrapSwitch();
                            // $('#' + lightSwitch.id).bootstrapSwitch('state', lightSwitch.val);
                        });
                    }, 500);
                });
            });
        }
        GetData();
    }
}
