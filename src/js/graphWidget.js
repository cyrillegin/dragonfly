export default class graphController {
    constructor($scope, $window, $timeout, $location, $http) {
        'ngInject';

        function DrawGraph(data) {
            // Initialization.
            const d3 = $window.d3;
            const container = $('#graph-container');
            container.html('');

            let width = container[0].clientWidth;
            let height = 400;
            const margin = {
                top: 20,
                right: 10,
                bottom: 30,
                left: 40,
            };
            width = width - margin.left - margin.right;
            height = height - margin.top - margin.bottom;
            let i = 0;
            let newText = '';

            // Apply calibration data.
            const coef = {
                x: 1,
                y: 0,
            };

            for (i = 0; i < data.readings.length; i ++) {
                data.readings[i].created = new Date(data.readings[i].created * 1000).getTime();
                data.readings[i].value = data.readings[i].value * coef.x + coef.y;
            }
            if (data.readings.length === 0) {
                $('#graph-container')[0].innerHTML = 'There arnt enough readings for this sensor to display anything.';
                return;
            }
            let start = data.readings[0].created;
            let end = data.readings[0].created;
            let min = data.readings[0].value;
            let max = data.readings[0].value;

            // Set min and max values
            for (i = 0; i < data.readings.length; i ++) {
                if (min > data.readings[i].value) {
                    min = data.readings[i].value;
                }
                if (max < data.readings[i].value) {
                    max = data.readings[i].value;
                }
                if (start > data.readings[i].created) {
                    start = data.readings[i].created;
                }
                if (end < data.readings[i].created) {
                    end = data.readings[i].created;
                }
            }
            if ($location.search().start_date !== undefined) {
                start = $location.search().start_date * 1000;
            }
            if ($location.search().end_date !== undefined) {
                end = $location.search().end_date * 1000;
            }

            // Create the svg.
            const newChart = d3.select('#graph-container')
                .append('svg')
                .attr('class', 'Chart-Container')
                .attr('id', 'Graph' + data.sensor.name)
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.bottom + ')')
                .classed('svg-content-responsive', true);
            if (data.readings.length === 0) {
                newChart.append('g').append('text')
                    .text('No data exists for this time range.')
                    .attr('class', 'ChartTitle-Text')
                    .attr('x', margin.left)
                    .attr('y', height / 2);
                return;
            }

            // Scale
            const xScale = d3.scaleTime()
                .domain([new Date(start), new Date(end)])
                .rangeRound([0, width]);

            const yScale = d3.scaleLinear()
                .domain([min, max + (max - min) * 0.1])
                .rangeRound([height, margin.bottom]);

            // Formats text for units display
            function getFormattedText(d) {
                const f = d3.format('.1f');
                let units = '';
                if (data.sensor !== undefined) {
                    units = data.sensor.units;
                }

                return f(d) + units;
            }

            // TOOL-TIPS
            // Tooltip container
            const tooltip = newChart.append('g')
                .style('display', 'none');

            // Tooltip helper
            const bisectDate = d3.bisector((d) => {
                return d.created;
            }).left;

            // Y-axis line for tooltip
            const yLine = tooltip.append('g')
                .append('line')
                .attr('class', 'tooltip-line')
                .style('stroke', 'blue')
                .style('stroke-dasharray', '3,3')
                .style('opacity', 0.5)
                .attr('y1', margin.bottom)
                .attr('y2', height);


            // Date text
            const timeText = tooltip.append('text')
                .attr('x', 0)
                .attr('y', margin.top - 5)
                .attr('width', 100)
                .attr('height', 100 * 0.4)
                .attr('fill', 'black');

            // Drag behaivors for the selection box.
            // const dragStart = 0, dragStartPos = 0, dragEnd = 0;
            // const drag = d3.drag()
            //     .on('drag', function(d,i) {
            //         const x0 = xScale.invert(d3.mouse(this)[0]);
            //         i = bisectDate(data.readings, x0, 1);
            //         const d0 = data.readings[i - 1],
            //             d1 = data.readings[i];
            //         d = x0 - d0.created > d1.created - x0 ? d1 : d0;

            //         if(xScale(d.created) > dragStartPos){
            //             selectionBox.attr('width', (xScale(d.created) - dragStartPos));
            //         } else {
            //             selectionBox.attr('width', ( dragStartPos - xScale(d.created)));
            //             selectionBox.attr('transform', 'translate(' + xScale(d.created) + ',0)' );
            //         }
            //     })
            //     .on('end', function(d,i){
            //         dragEnd = d3.mouse(this)[0];
            //         if(Math.abs(dragStart - dragEnd) < 10) return;

            //         const x0 = xScale.invert(dragStart), x1 = xScale.invert(dragEnd);

            // scope.$apply(function(){
            //     if(x1 > x0){
            //         $location.search('start_date', x0.getTime());
            //         $location.search('end_date',x1.getTime());
            //     } else {
            //         $location.search('start_date', x1.getTime());
            //         $location.search('end_date',x0.getTime());
            //     }
            // });
            // });
            // Update loop for tooltips.
            const circleElements = [];
            const lineElements = [];
            const textElements = [];

            function mousemove() {
                const x0 = xScale.invert(d3.mouse(this)[0]); // jshint ignore:line
                const i = bisectDate(data.readings, x0, 1);
                const d0 = data.readings[i - 1];
                const d1 = data.readings[i];
                if (d1 === undefined) {
                    return;
                }
                const d = x0 - d0.created > d1.created - x0 ? d1 : d0;

                circleElements[0].attr('transform', 'translate(' + xScale(d.created) + ',' + yScale(d.value) + ')');
                yLine.attr('transform', 'translate(' + xScale(d.created) + ',' + 0 + ')');
                // lineElements[0].attr('transform', 'translate(' + 0 + ',' + yScale(d.value) + ')');
                // uncomment this line for update of horizontal line tooltip
                timeText.text(new Date(d.created));

                textElements[0]
                    .text(getFormattedText(d.value))
                    .attr('transform', 'translate(' + (xScale(d.created) + 10) + ',' + (yScale(d.value) - 10) + ')');
            }

            // Selection box
            const selectionBox = newChart.append('rect')
                .attr('fill', 'none')
                .attr('opacity', 0.5)
                .attr('x', 0)
                .attr('y', margin.top)
                .attr('width', 14)
                .attr('height', height - margin.top);

            // Hit area for selection box
            newChart.append('rect')
                .attr('width', width)
                .attr('height', height)
                .style('fill', 'none')
                .style('pointer-events', 'all')
                .on('mouseover', () => {
                    tooltip.style('display', null);
                })
                .on('mouseout', () => {
                    tooltip.style('display', 'none');
                })
                .on('mousemove', mousemove)
                .on('mousedown', () => {
                    selectionBox.attr('fill', '#b7ff64');
                    // dragStart = d3.mouse(this)[0];

                    const x0 = xScale.invert(d3.mouse(this)[0]);
                    const i = bisectDate(data.readings, x0, 1);
                    const d0 = data.readings[i - 1];
                    const d1 = data.readings[i];
                    const d = x0 - d0.created > d1.created - x0 ? d1 : d0;
                    selectionBox.attr('transform', 'translate(' + xScale(d.created) + ',0)');
                    // dragStartPos = xScale(d.created);
                });
            // .call(drag);

            // Y Axis
            function getTic() {
                const Ticks = [];
                const ratio = (max - min) / 6;
                for (let i = 0; i < 7; i ++) {
                    Ticks.push(min + (ratio * i));
                }
                return Ticks;
            }

            const yAxis = d3.axisLeft(yScale)
                .tickSizeInner(- width)
                .tickSizeOuter(0)
                .tickValues(getTic())
                .tickFormat((d) => {
                    const f = d3.format('.1f');
                    return f(d) + ' ' + data.sensor.units;
                });

            newChart.append('g')
                .attr('class', 'ChartAxis-Shape')
                .call(yAxis);

            // X Axis
            const xAxis = d3.axisBottom(xScale)
                .tickSizeInner(- height + margin.bottom)
                .tickSizeOuter(0)
                .tickPadding(10)
                .ticks(5);

            newChart.append('g')
                .attr('class', 'ChartAxis-Shape')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);

            // Top border
            newChart.append('g')
                .append('line')
                .attr('class', 'ChartAxis-Shape')
                .attr('x1', 0)
                .attr('x2', width)
                .attr('y1', margin.bottom)
                .attr('y2', margin.bottom);

            // Right border
            newChart.append('g')
                .append('line')
                .attr('class', 'ChartAxis-Shape')
                .attr('x1', width)
                .attr('x2', width)
                .attr('y1', margin.bottom)
                .attr('y2', height);

            // Graph title
            newChart.append('text')
                .attr('class', 'ChartTitle-Text')
                .attr('x', 0)
                .attr('y', 0)
                .text(data.sensor.name);

            // Legend
            const colors = ['#FFB90F', '#62f1ff', 'blue', 'red', 'green', 'yellow'];

            // Legend text
            newChart.append('text')
                .attr('class', 'ChartLegend-Text')
                .style('text-anchor', 'end')
                .attr('x', width - 18)
                .attr('y', 10)
                .text(data.sensor.name);

            // Legend icon
            newChart.append('rect')
                .attr('fill', colors[i])
                .attr('x', width - 16)
                .attr('y', 0)
                .attr('width', 14)
                .attr('height', 14);

            // Graph lines
            const lineFunction = d3.line()
                .defined(() => {
                    // TODO: add linebreak behaivor
                    return true;
                })
                .x((d) => {
                    return xScale(d.created);
                })
                .y((d) => {
                    return yScale(d.value);
                });

            newChart.append('path')
                .attr('d', lineFunction(data.readings))
                .attr('stroke', colors[0])
                .attr('stroke-width', 2)
                .attr('fill', 'none');

            // Tooltip circle
            const newCircle = tooltip.append('circle')
                .attr('class', 'tooltip-circle')
                .style('fill', 'none')
                .style('stroke', 'blue')
                .attr('r', 4);
            circleElements.push(newCircle);

            // Use if horizontal lines are desired, uncomment line in mousemove() to get correct positioning
            const newLine = tooltip.append('line')
                .attr('class', 'tooltip-line')
                .style('stroke', 'blue')
                .style('stroke-dasharray', '3,3')
                .style('opacity', 0.5)
                .attr('x1', 0)
                .attr('x2', width);
            lineElements.push(newLine);
            // Tooltip text
            newText = tooltip.append('text')
                .attr('width', 100 * 2)
                .attr('height', 100 * 0.4)
                .attr('fill', 'black');
            textElements.push(newText);
        } // End D3

        function GetGraph() {
            const args = $location.search();
            const d = new Date();
            let start = Math.round((d.getTime() - 1000 * 60 * 60 * 24) / 1000);
            let end = Math.round(d.getTime() / 1000);
            if (args.start_date !== undefined) {
                start = args.start_date;
            }
            if (args.end_date !== undefined) {
                end = args.end_date;
            }

            // $http.get('reading/?sensor=' + dataService.selection() + '&start=' + start + '&end=' + end)
            //     .then(function successCallback(response) {
            //         DrawGraph(response.data);
            //     }, function errorCallback(response) {
            //         console.log('An error has occured.', response.data);
            //     });
            //   }

            $timeout(() => {
                $('#start_date').datetimepicker();
                $('#end_date').datetimepicker();
            });

            $scope.SubmitDate = () => {
                const newDates = {
                    start: $('#start_date').data('DateTimePicker').date(),
                    end: $('#end_date').data('DateTimePicker').date(),
                };
                $timeout(() => {
                    $scope.$apply(() => {
                        $location.search('start_date', newDates.start === null ? undefined : newDates.start.unix());
                        $location.search('end_date', newDates.end === null ? undefined : newDates.end.unix());
                        GetGraph();
                    });
                });
            };

            const readingAttrs = [{
                name: 'Sensor',
                type: 'multiple',
                value: [],
                id: 'modal_sensor',
                fieldName: 'sensor',
            }, {
                name: 'value',
                type: 'text',
                value: 7,
                id: 'modal_value',
                fieldName: 'value',
            }, {
                name: 'date',
                type: 'date',
                value: 1000000,
                id: 'modal_date',
                fieldName: 'created',
            }];

            $timeout(() => {
                // const sensors = dataService.data();
                sensors.forEach((i) => {
                    readingAttrs[0].value.push({
                        name: i.name,
                    });
                });
            });

            $scope.addReading = () => {
                $scope.modalAttributes.push({
                    sensor: null,
                    date: null,
                    value: 0,
                    id: $scope.modalAttributes.length + 1,
                });
                $timeout(() => {
                    $('#date-' + $scope.modalAttributes.length).datetimepicker();
                });
            };

            $scope.OpenModal = () => {
                $('#sensorEditModal').modal('toggle');
                $('#modal_alert').css('display', 'hidden');
                // const selection = dataService.selection();
                // const data = dataService.data();
                $scope.modalAttributes = [{
                    sensor: selection,
                    date: 1,
                    value: 0,
                    id: 1,
                }];
                $scope.sensorlist = [];
                data.forEach((sensor) => {
                    $scope.sensorlist.push({
                        name: sensor.name,
                    });
                });

                $timeout(() => {
                    // $('#date-1').datetimepicker();
                });
            };

            $scope.SubmitModal = () => {
                const url = 'reading';
                let error = false;
                const dataObjects = [];
                $scope.modalAttributes.forEach((reading) => {
                    const data = {
                        sensor: {
                            name: $('#sensor-' + reading.id)[0].selectedOptions[0].innerText,
                        },
                        readings: [{
                            value: parseFloat($('#value-' + reading.id)[0].value),
                            timestamp: $('#date-' + reading.id).data('DateTimePicker').date().unix(),
                        }],
                    };
                    if (data.sensor.name === '') {
                        $('#modal_alert').html('readings need a sensor name.');
                        $('#modal_alert').css('display', 'block');
                        error = true;
                        return;
                    }
                    if (isNaN(data.readings[0].value)) {
                        $('#modal_alert').html('Values must be numbers.');
                        $('#modal_alert').css('display', 'block');
                        error = true;
                        return;
                    }
                    dataObjects.push(data);
                });
                if (error === true) {
                    return;
                }
                dataObjects.forEach((file) => {
                    $http.post(url, file).then((response) => {
                        console.log(response);
                        $('#sensorEditModal').modal('toggle');
                    }, (response) => {
                        console.log('An error has occured.', response.data);
                        $('#modal_alert').html(response.data.error);
                        $('#modal_alert').css('display', 'block');
                    }).then(() => {
                        console.log('all done');
                    });
                });
            };

            // $scope.$watch(function() {
            //     return dataService.selection();
            // }, function(v) {
            //     if (v === undefined) {
            //         return;
            //     }
            //     if (dataService.data === undefined) {
            //         return;
            //     }
            //     GetGraph();
            // });
        }
    }
  }
