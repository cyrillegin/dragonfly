import * as d3 from 'd3';

export default class gaugeController {

    constructor($scope, $timeout, $http) {
        'ngInject';

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$http = $http;
        this.$scope.gauges = [];
    }

    $onInit() {
        this.$timeout(() => {
            this.drawTempChart(this.attributes);
        });
    }

    DrawTempChart(sensor) {
        if (sensor.lastReading === null) {
            return;
        }

        const width = 200;
        const height = 140;

        const svg = d3.select(`#${sensor.name}`)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const arc = d3.arc()
            .innerRadius(50)
            .outerRadius(80)
            .padAngle(0);

        const color = ['#d73027', '#91cf60', '#198CFF'].reverse();

        const pie = d3.pie()
            .startAngle(- Math.PI / 2)
            .endAngle(Math.PI / 2)
            .value((d) => d);

        const arcLines = [
            sensor.max_value - sensor.min_value,
            sensor.max_value - sensor.min_value,
            sensor.max_value - sensor.min_value,
        ].reverse();

        svg.selectAll('.arc')
            .data(pie(arcLines))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('transform', 'translate(100,100)')
            .style('fill', (d, i) => color[i]);

        svg.selectAll('.needle')
            .data([sensor.lastReading])
            .enter()
            .append('line')
            .attr('x1', 0)
            .attr('x2', - 78)
            .attr('y1', 0)
            .attr('y2', 0)
            .style('stroke', 'black')
            .attr('transform', (d) => {
                const r = 180 * (d / arcLines[0]);
                return ` translate(100, 100) rotate(${r})`;
            });

        // Title
        svg.append('text')
            .style('text-anchor', 'middle')
            .attr('x', width / 2)
            .attr('y', height - 25)
            .text(sensor.name);

        // Display
        svg.append('text')
            .style('text-anchor', 'middle')
            .attr('class', 'ChartTitle-Text')
            .attr('x', width / 2)
            .attr('y', height - 40)
            .text(sensor.lastReading.toFixed(1));
    }
}
