export default class sensorController {

    constructor($scope, $window, $http) {
        'ngInject'

        let data;
        let selection;

        function LoadValues() {
            if (selection === undefined || selection[0] === undefined) {
                return;
            }
            if (data === undefined || data[0] === undefined) {
                return;
            }
            data.forEach((i) => {
                if (i.name === selection) {
                    $scope.sensorName = selection;
                    $scope.sensorDescription = i.description;
                    $scope.sensorCoefficients = i.coefficients;
                    $scope.sensorType = i.self_type;
                    $scope.sensorUnits = i.units;
                    $scope.sensorMinValue = i.min_value;
                    $scope.sensorMaxValue = i.max_value;
                    $scope.sensorStation = i.station;
                }
            });
        }

        $scope.$watch(function() {
            // return dataService.selection();
        }, function(v) {
            if (v === undefined) {
                return;
            }
            selection = v;
            LoadValues();
        });

        $scope.$watch(function() {
            // return dataService.data();
        }, function(v) {
            if (v === undefined) {
                return;
            }
            data = v;
            LoadValues();
        });

        $scope.SaveSensor = function() {
            data = {
                'name': $scope.sensorName,
                'description': $scope.sensorDescription,
                'coefficients': $scope.sensorCoefficients,
                'sensor_type': $scope.sensorType,
                'units': $scope.sensorUnits,
                'min_value': $scope.sensorMinValue,
                'max_value': $scope.sensorMaxValue,
                'station': $scope.sensorStation,
            };

            $http.post('sensor', data).then(function successCallback() {
                $('#message').html('Sensor update successfully.');
                $('#message').toggleClass('alert alert-success');
            }, function errorCallback(response) {
                console.log("An error has occured.");
                console.log(response);
                $('#message').html('Oops! Something went wrong.');
                $('#message').toggleClass('alert alert-danger');
            });
        };
    }
}
