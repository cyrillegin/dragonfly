import * as d3 from 'd3';

export default class gaugeController {

    constructor($scope, $timeout, $http) {
        'ngInject';

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$http = $http;
        this.$scope.gauges = [];
        this.GetData();
    }

    GetData() {
        this.$http.get('api/sensor')
            .then((success) => {
                success.data.sensor_list.forEach((i) => {

                    if (i.self_type === 'temperature') {

                        this.$scope.gauges.push(i);
                    }
                });
            })
            .catch((error) => {
                console.log('error');
                console.log(response);
            });
    }
}
