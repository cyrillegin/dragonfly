import * as d3 from 'd3';

export default class gaugeController {

    constructor($scope, $timeout, $http) {
        'ngInject';

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$http = $http;

        $scope.gauges = [];

        this.GetData();
    }

    valueToDegrees(value, config) {
        return value / config.range * 270 - (config.min / config.range * 270 + 45);
    }

    valueToRadians(value, config) {
        return this.valueToDegrees(value, config) * Math.PI / 180;
    }

    valueToPoint(value, factor, config) {
        return {
            x: config.cx - config.raduis * factor * Math.cos(this.valueToRadians(value, config)),
            y: config.cy - config.raduis * factor * Math.sin(this.valueToRadians(value, config)),
        };
    }

    redraw(id, value, transitionDuration, config) {

        const svg = d3.select('#gaugeChart-' + id);

        const pointerContainer = svg.select('.pointerContainer');

        pointerContainer.selectAll('text').text(Math.round(value));

        const pointer = pointerContainer.selectAll('path');
        pointer.transition()
            .duration(undefined !== transitionDuration ? transitionDuration : config.transitionDuration)
            .attrTween('transform', () => {
                let pointerValue;

                if (value > config.max) {
                    pointerValue = config.max + 0.02 * config.range;
                } else if (value < config.min) {
                    pointerValue = config.min - 0.02 * config.range;
                }
                const targetRotation = (this.valueToDegrees(pointerValue, config) - 90);
                const currentRotation = this._currentRotation || targetRotation;
                this._currentRotation = targetRotation;

                return (step) => {
                    const rotation = currentRotation + (targetRotation - currentRotation) * step;
                    return 'translate(' + config.cx + ', ' + config.cy + ') rotate(' + (225 + rotation) + ')';
                };
            });
    }

    DrawTempChart(data, id) {
        const config = {
            size: 90,
            label: data.name,
            min: data.min_value - data.min_value * 0.2,
            max: data.max_value + data.min_value * 0.2,
        };

        config.yellowZones = [{
            from: config.min,
            to: data.min_value,
        }];
        config.redZones = [{
            from: data.max_value,
            to: config.max,
        }];
        config.greenZones = [{
            from: data.min_value,
            to: data.max_value,
        }];

        config.raduis = config.size * 0.97 / 2;
        config.cx = config.size / 2;
        config.cy = config.size / 2;

        config.range = config.max - config.min;

        config.majorTicks = 5;
        config.minorTicks = 2;

        config.greenColor = '#109618';
        config.yellowColor = '#FF9900';
        config.redColor = '#DC3912';

        config.transitionDuration = 500;

        const svg = d3.select('#gaugeChart-' + data.name)
            .append('svg:svg')
            .attr('class', 'gauge')
            .attr('width', config.size)
            .attr('height', config.size);

        svg.append('svg:circle')
            .attr('cx', config.cx)
            .attr('cy', config.cy)
            .attr('r', config.raduis)
            .style('fill', '#ccc')
            .style('stroke', '#000')
            .style('stroke-width', '0.5px');

        svg.append('svg:circle')
            .attr('cx', config.cx)
            .attr('cy', config.cy)
            .attr('r', 0.9 * config.raduis)
            .style('fill', '#fff')
            .style('stroke', '#e0e0e0')
            .style('stroke-width', '2px');

        const that = this;

        function drawBand(start, end, color) {
            if (0 >= end - start) {
                return;
            }

            svg.append('svg:path')
                .style('fill', color)
                .attr('d', d3.arc()
                    .startAngle(that.valueToRadians(start, config))
                    .endAngle(that.valueToRadians(end, config))
                    .innerRadius(0.65 * config.raduis)
                    .outerRadius(0.85 * config.raduis))
                .attr('transform', () => {
                    return 'translate(' + config.cx + ', ' + config.cy + ') rotate(270)';
                });
        }

        config.greenZones.forEach((i) => {
            drawBand(i.from, i.to, config.greenColor);
        });

        config.yellowZones.forEach((i) => {
            drawBand(i.from, i.to, config.yellowColor);
        });

        config.redZones.forEach((i) => {
            drawBand(i.from, i.to, config.redColor);
        });

        let fontSize;
        if (config.label !== undefined) {
            fontSize = Math.round(config.size / 9);
            svg.append('svg:text')
                .attr('x', config.cx)
                .attr('y', config.cy / 2 + fontSize / 2)
                .attr('dy', fontSize / 2)
                .attr('text-anchor', 'middle')
                .text(config.label)
                .style('font-size', fontSize + 'px')
                .style('fill', '#333')
                .style('stroke-width', '0px');
        }

        fontSize = Math.round(config.size / 16);
        const majorDelta = config.range / (config.majorTicks - 1);
        for (let major = config.min; major <= config.max; major += majorDelta) {
            const minorDelta = majorDelta / config.minorTicks;
            let point1;
            let point2;
            for (let minor = major + minorDelta; minor < Math.min(major + majorDelta, config.max); minor += minorDelta) {
                point1 = this.valueToPoint(minor, 0.75, config);
                point2 = this.valueToPoint(minor, 0.85, config);

                svg.append('svg:line')
                    .attr('x1', point1.x)
                    .attr('y1', point1.y)
                    .attr('x2', point2.x)
                    .attr('y2', point2.y)
                    .style('stroke', '#666')
                    .style('stroke-width', '1px');
            }

            point1 = this.valueToPoint(major, 0.7, config);
            point2 = this.valueToPoint(major, 0.85, config);

            svg.append('svg:line')
                .attr('x1', point1.x)
                .attr('y1', point1.y)
                .attr('x2', point2.x)
                .attr('y2', point2.y)
                .style('stroke', '#333')
                .style('stroke-width', '2px');

            if (major === config.min || major === config.max) {
                const point = this.valueToPoint(major, 0.63, config);

                svg.append('svg:text')
                    .attr('x', point.x)
                    .attr('y', point.y)
                    .attr('dy', fontSize / 3)
                    .attr('text-anchor', major === config.min ? 'start' : 'end')
                    .text(major)
                    .style('font-size', fontSize + 'px')
                    .style('fill', '#333')
                    .style('stroke-width', '0px');
            }
        }

        const pointerContainer = svg.append('svg:g').attr('class', 'pointerContainer');

        const midValue = (config.min + config.max) / 2;

        function buildPointerPath() {
            // const delta = config.range / 13;
            //
            // let head = valueToPoint(value - majorDelta, 0.85, config);
            // const tailValue = value - (config.range * (1 / (270 / 360)) / 2);
            // let tail = valueToPoint(tailValue, 0.28, config);

            const head = {
                x: 0,
                y: 0,
            };
            const tail = {
                x: 30,
                y: 30,
            };

            return [head, tail];

            // function valueToPoint(value, factor) {
            //     var point = { 'x': 0, 'y': 0 };
            //     point.x += value * factor;
            //     point.y += value * factor;
            //     return point;
            // }
        }

        const pointerPath = buildPointerPath(midValue);

        const pointerLine = d3.line()
            .x((d) => {
                return d.x;
            })
            .y((d) => {
                return d.y;
            })
            .curve(d3.curveBasis);

        pointerContainer.selectAll('path')
            .data([pointerPath])
            .enter()
            .append('svg:path')
            .attr('d', pointerLine)
            .style('fill', '#dc3912')
            .style('stroke', '#c63310')
            .style('fill-opacity', 0.7);

        pointerContainer.append('svg:circle')
            .attr('cx', config.cx)
            .attr('cy', config.cy)
            .attr('r', 0.12 * config.raduis)
            .style('fill', '#4684EE')
            .style('stroke', '#666')
            .style('opacity', 1);

        fontSize = Math.round(config.size / 10);
        pointerContainer.selectAll('text')
            .data([midValue])
            .enter()
            .append('svg:text')
            .attr('x', config.cx)
            .attr('y', config.size - config.cy / 4 - fontSize)
            .attr('dy', fontSize / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', fontSize + 'px')
            .style('fill', '#000')
            .style('stroke-width', '0px');

        const val = data.lastReading;
        this.redraw(id, val, 10, config);
        if (this.$scope.gauges[id] !== undefined) {
            this.$scope.gauges[id].config = config;
        }
    }

    GetData() {
        this.$http.get('api/sensor')
            .then(
                (response) => {
                    response.data.sensor_list.forEach((i) => {
                        if (i.self_type === 'temperature') {
                            this.$scope.gauges.push({
                                id: 'gaugeChart-' + i.name,
                            });
                        }
                    });

                    this.$timeout(() => {
                        for (let i = 0; i < response.data.sensor_list.length - 1; i ++) {
                            if (response.data.sensor_list[i].self_type === 'temperature') {
                                this.DrawTempChart(response.data.sensor_list[i], i);
                            }
                        }
                    }, 500);
                },
                (response) => {
                    console.log('error');
                    console.log(response);
                },
            );
    }
}
