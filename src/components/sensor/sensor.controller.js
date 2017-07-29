export default class sensorController {

    constructor($scope, $window, $http, $location) {
        'ngInject';

        this.$http = $http;
        this.$location = $location;
        this.$scope = $scope;
    }

    $onInit() {
        this.$scope.SaveSensor = () => {
            this.data = {
                name: this.$scope.sensorName,
                description: this.$scope.sensorDescription,
                coefficients: this.$scope.sensorCoefficients,
                sensor_type: this.$scope.sensorType,
                units: this.$scope.sensorUnits,
                min_value: this.$scope.sensorMinValue,
                max_value: this.$scope.sensorMaxValue,
                station: this.$scope.sensorStation,
            };

            this.$http.post('api/sensor', this.data)
                .then((success) => {
                    $('#message').html('Sensor update successfully.');
                    $('#message').toggleClass('alert alert-success');
                })
                .catch((error) => {
                    console.log('An error has occured.');
                    console.log(error);
                    $('#message').html('Oops! Something went wrong.');
                    $('#message').toggleClass('alert alert-danger');
                });
        };
        this.LoadValues();
    }

    LoadValues() {
        this.$http.get('api/sensor/' + this.$location.search().sensor)
            .then((success) => {

                this.$scope.sensorName = success.data.name;
                this.$scope.sensorDescription = success.data.description;
                this.$scope.sensorCoefficients = success.data.coefficients;
                this.$scope.sensorType = success.data.self_type;
                this.$scope.sensorUnits = success.data.units;
                this.$scope.sensorMinValue = success.data.min_value;
                this.$scope.sensorMaxValue = success.data.max_value;
                this.$scope.sensorStation = success.data.station;

            })
            .catch((error) => {
                console.log('Error retriving sensor');
                console.log(error);
            });
    }
}
