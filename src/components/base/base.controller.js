import './base.style.scss';
import gaugeContainer from './../gauge/gaugeContainer.html';

export default class mainController {
    constructor($scope, $timeout, $http, $window, $mdSidenav, $mdBottomSheet) {
        'ngInject';

        this.$scope = $scope;
        this.$http = $http;
        this.$window = $window;
        this.$timeout = $timeout;

        $scope.toggleLeft = buildToggler('left');
        function buildToggler(componentId) {
            return function () {
                console.log('go');
                $mdSidenav(componentId).toggle();
            };
        }

        $scope.toggleRight = buildToggler('right');
        function buildToggler(componentId) {
            return function () {
                console.log('go');
                $mdSidenav(componentId).toggle();
            };
        }

        $scope.showGridBottomSheet = function () {
            $scope.alert = '';
            $mdBottomSheet.show({
                template: gaugeContainer,
                controller: 'gaugeController',
            }).then((clickedItem) => {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(clickedItem['name'] + ' clicked!')
                        .position('top right')
                        .hideDelay(1500),
                );
            }).catch((error) => {
                // User clicked outside or hit escape
            });
        };
    }

    $onInit() {
        this.$scope.graphIndex = 0;

        // this.$http.get('api/camera')
        //     .then((success) => {
        //         this.$scope.fishcam = '/images/fishcam/image_' + success.data + '.jpg';
        //     })
        //     .catch((error) => {
        //         console.log('error');
        //         console.log(error);
        //     });

        $('#footer-drawer').on('click', () => {
            $('#footer-drawer').toggleClass('footer-drawer-open');
            $('#open-button').toggleClass('glyphicon-chevron-up');
            $('#open-button').toggleClass('glyphicon-chevron-down');
            $('#bottom-bar-container').toggleClass('bottom-bar-container-open');
        });

        this.GetData();
    }

    GetData() {
        this.$http.get('/api/sensor')
            .then((success) => {
                this.$scope.lightSwitchCharts = [];
                success.data.sensor_list.forEach((i) => {
                    if (i.self_type === 'lightswitch') {
                        this.DrawLightSwitch(i);
                    }
                });
            })
            .catch((error) => {
                console.log('error');
                console.log(error);
            });
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
