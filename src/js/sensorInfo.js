export default class sensorController {

    constructor($scope, $window, $http, $location) {
        'ngInject';

        this.$http = $http;
        this.$location = $location;
        this.$scope = $scope;
        
        $scope.SaveSensor = () => {
            this.data = {
                name: $scope.sensorName,
                description: $scope.sensorDescription,
                coefficients: $scope.sensorCoefficients,
                sensor_type: $scope.sensorType,
                units: $scope.sensorUnits,
                min_value: $scope.sensorMinValue,
                max_value: $scope.sensorMaxValue,
                station: $scope.sensorStation,
            };

            $http.post('api/sensor', this.data).then(
                (success) => {
                    console.log(success);
                    $('#message').html('Sensor update successfully.');
                    $('#message').toggleClass('alert alert-success');
                },
                (error) => {
                    console.log('An error has occured.');
                    console.log(error);
                    $('#message').html('Oops! Something went wrong.');
                    $('#message').toggleClass('alert alert-danger');
                },
            );
        };
        this.LoadValues();
    }

    LoadValues() {
        this.$http.get('api/sensor/' + this.$location.search().sensor).then(
            (success) => {
                console.log(success);

                this.$scope.sensorName = success.data.name;
                this.$scope.sensorDescription = success.data.description;
                this.$scope.sensorCoefficients = success.data.coefficients;
                this.$scope.sensorType = success.data.self_type;
                this.$scope.sensorUnits = success.data.units;
                this.$scope.sensorMinValue = success.data.min_value;
                this.$scope.sensorMaxValue = success.data.max_value;
                this.$scope.sensorStation = success.data.station;

            },
            (error) => {
                console.log('Error retriving sensor');
                console.log(error);
            },
        );
        console.log(this.data);

    }
}
