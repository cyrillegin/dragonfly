/*jslint node: true */
'use strict';

angular.module('dragonfly.maincontroller', [])

    .controller("mainController", ['$scope', '$timeout', 'apiService', 'dataService', function($scope, $timeout, apiService, dataService) {

        const switchids = [];
        $scope.graphIndex = 0;

        $timeout(function() {
            apiService.get('camera').then(function successCallback(response) {
                $scope.fishcam = 'images/fishcam/image_' + response.data + '.jpg';
            });
        });

        function DrawLightSwitch(data) {
            const switchObj = {
                "title": data.name,
                "id": "switch-" + data.name,
                'val': data.lastReading,
            };
            $scope.lightSwitchCharts.push(switchObj);
            switchids.push(switchObj.id);
        }

        function GetData() {
            apiService.get('sensor').then(function successCallback(response) {
                $scope.lightSwitchCharts = [];
                dataService.set(response.data.sensor_list);
                response.data.sensor_list.forEach((i) => {
                    if (i.self_type === "lightswitch") {
                        DrawLightSwitch(i);
                    }
                });
            }, function errorCallback(response) {
                console.log("An error has occured.", response.data);
            }).then(function() {
                //initialize bootstrap switches
                $timeout(function() {
                    switchids.forEach((i) => {
                        if ($scope.lightSwitchCharts[i] === undefined) {
                            return;
                        }
                        $('#' + switchids[i]).bootstrapSwitch();
                        $('#' + switchids[i]).bootstrapSwitch('state', $scope.lightSwitchCharts[i].val);
                    });
                }, 500);
            });
        }
        GetData();
    }, ]);
