import * as d3 from 'd3';

export default class gaugeController {

    constructor($scope, $timeout, $http) {
        'ngInject';

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$http = $http;

        $scope.gauges = [];
        $(() => {
            $('#footerDrawer').on('click', () => {
                console.log('asdf');
                $('#footerDrawer').toggleClass('footerDrawerOpen');
                $('#open-button').toggleClass('glyphicon-chevron-up');
                $('#open-button').toggleClass('glyphicon-chevron-down');
            });
        });

        this.GetData();
    }

    GetData() {
        this.$http.get('api/sensor')
            .then(
                (success) => {
                    success.data.sensor_list.forEach((i) => {
                        if (i.self_type === 'temperature') {
                            this.$scope.gauges.push({
                                id: 'gaugeChart-' + i.name,
                            });
                        }
                    });

                    this.$timeout(() => {
                        for (let i = 0; i < success.data.sensor_list.length - 1; i ++) {
                            if (success.data.sensor_list[i].self_type === 'temperature') {
                                this.DrawTempChart(success.data.sensor_list[i], i);
                            }
                        }
                    }, 500);
                },
                (error) => {
                    console.log('error');
                    console.log(response);
                },
            );
    }

    DrawTempChart(sensor, index) {

        const width = 200;
        const height = 100;

        const svg = d3.select('#gaugeChart-' + sensor.name)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const arc = d3.arc()
            .innerRadius(50)
            .outerRadius(80)
            .padAngle(0);

        const color = ['#91cf60', '#d9ef8b', '#fee08b', '#fc8d59', '#d73027'].reverse();

        let data = makeData();
        console.log(data)

        const pie = d3.pie()
            .startAngle(- Math.PI / 2)
            .endAngle(Math.PI / 2)
            .value((d) => {
                return d;
            });

        const arcLines = [
            sensor.max_value * 1.1,
            sensor.max_value,
            sensor.min_value,
            sensor.min_value * 0.9,
        ]

        const arcs = svg.selectAll('.arc')
            .data(pie(arcLines))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('transform', 'translate(100,100)')
            .style('fill', (d, i) => {
                return color[ i ];
            });

        const needle = svg.selectAll('.needle')
            .data([sensor.lastReading])
            .enter()
            .append('line')
            .attr('x1', 0)
            .attr('x2', - 78)
            .attr('y1', 0)
            .attr('y2', 0)
            .style('stroke', 'black')
            .attr('transform', (d) => {
                const r = 180 * d / arcLines[ 3 ];
                return ' translate(100, 100) rotate(' + r + ')';
            });

        console.log(sensor)

        d3.select('#button')
            .on('click', () => {
                data = makeData();
                arcs.data(pie(arcLines))
                    .transition()
                    .attr('d', arc);
                needle.data([sensor.lastReading])
                    .transition()
                    .ease(d3.easeElasticOut)
                    .duration(2000)
                    .attr('transform', (d) => {
                        r = 180 * d / arcLines;
                        return ' translate(100, 100) rotate(' + r + ')';
                    });
            });

        function makeData() {
            const newarcsdata = d3.range(4)
                .map(() => {
                    return d3.randomUniform()();
                })
                .sort();
            const newneedledata = [d3.randomUniform(0, newarcsdata[ 3 ])()];
            return [newneedledata, newarcsdata];
        };
    }
}
