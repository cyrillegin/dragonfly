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

    }

    $onInit() {
        this.$scope.backupWarning = false;

        const jinjaData = $('#jinja-vars').data();
        if (jinjaData.time * 1000 + (60 * 60 * 24 * 14) < Date.now()) {
            console.log('too old');
            this.$scope.backupWarning = true;
            $('#backup-warning').html(`Last database back was ${new Date(jinjaData.time * 1000)}`);
        }

        this.$scope.toggleLeft = buildToggler('left');
        function buildToggler(componentId) {
            return function () {
                console.log('go');
                this.$mdSidenav(componentId).toggle();
            };
        }

        this.$scope.toggleRight = buildToggler('right');
        function buildToggler(componentId) {
            return function () {
                console.log('go');
                this.$mdSidenav(componentId).toggle();
            };
        }

        this.$scope.showGridBottomSheet = function () {
            this.$scope.alert = '';
            this.$mdBottomSheet.show({
                template: gaugeContainer,
                controller: gaugeContainerController,
            })
                .then((clickedItem) => {
                    this.$mdToast.show(
                        this.$mdToast.simple()
                            .textContent(`${clickedItem.name} clicked!`)
                            .position('top right')
                            .hideDelay(1500),
                    );
                })
                .catch((error) => {
                    // User clicked outside or hit escape
                });
        };

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

        this.getData();
    }

    getData() {
        this.$http.get('/api/sensor')
            .then((success) => {
                this.$scope.lightSwitchCharts = [];
                success.data.sensor_list.forEach((i) => {
                    if (i.self_type === 'lightswitch') {
                        this.drawLightSwitch(i);
                    }
                });
            })
            .catch((error) => {
                console.log('error');
                console.log(error);
            });
    }

    drawLightSwitch(data) {
        const switchObj = {
            title: data.name,
            id: `switch-${data.name.split(' ').join('')}`,
            val: data.lastReading,
        };
        this.$scope.lightSwitchCharts.push(switchObj);
    }
}
