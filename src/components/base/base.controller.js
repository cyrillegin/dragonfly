import './base.style.scss';
import gaugeContainer from './../gauge/gaugeContainer.html';
import gaugeContainerController from './../gauge/gauge.container.controller';

export default class mainController {
    constructor($scope, $timeout, $http, $window, $mdSidenav, $mdBottomSheet) {
        'ngInject';

        this.$scope = $scope;
        this.$http = $http;
        this.$window = $window;
        this.$timeout = $timeout;

        $scope.backupWarning = false;

        const jinjaData = $('#jinja-vars').data();
        if (jinjaData.time * 1000 + (60 * 60 * 24 * 14) < Date.now()) {
            console.log('too old');
            $scope.backupWarning = true;
            $('#backup-warning').html('Last database back was ' + new Date(jinjaData.time * 1000));
        }

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
                controller: gaugeContainerController,
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
