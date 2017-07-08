/*jslint node: true */
'use strict';

angular.module('dragonfly.graphcontroller', [])

    .controller("graphController", ['$scope', 'dataService', '$window', 'apiService', '$timeout', '$location', function($scope, dataService, $window, apiService, $timeout, $location) {

        function DrawGraph(data) {
            // Initialization.
            const d3 = $window.d3;
            const container = $('#graph-container');
            container.html("");

            let width = container[0].clientWidth,
                height = 400;
            const margin = {
                top: 20,
                right: 10,
                bottom: 30,
                left: 40,
            };
            width = width - margin.left - margin.right;
            height = height - margin.top - margin.bottom;
            let i, newText;

            // Apply calibration data.
            const coef = {
                "x": 1,
                "y": 0,
            };

            for (i = 0; i < data.readings.length; i++) {
                data.readings[i].created = new Date(data.readings[i].created * 1000).getTime();
                data.readings[i].value = data.readings[i].value * coef.x + coef.y;
            }
            if (data.readings.length === 0) {
                $('#graph-container')[0].innerHTML = "There arn't enough readings for this sensor to display anything.";
                return;
            }
            let start = data.readings[0].created;
            let end = data.readings[0].created;
            let min = data.readings[0].value;
            let max = data.readings[0].value;

            // Set min and max values
            for (i = 0; i < data.readings.length; i++) {
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
                .append("svg")
                .attr("class", "Chart-Container")
                .attr("id", "Graph" + data.sensor.name)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")")
                .classed("svg-content-responsive", true);
            if (data.readings.length === 0) {
                newChart.append("g").append("text")
                    .text("No data exists for this time range.")
                    .attr("class", "ChartTitle-Text")
                    .attr("x", margin.left)
                    .attr("y", height / 2);
                return;
            }

            // Scale
            const xScale = d3.scaleTime()
                .domain([new Date(start), new Date(end), ])
                .rangeRound([0, width, ]);

            const yScale = d3.scaleLinear()
                .domain([min, max + (max - min) * 0.1, ])
                .rangeRound([height, margin.bottom, ]);

            // Formats text for units display
            function getFormattedText(d) {
                const f = d3.format(".1f");
                let units = "";
                if (data.sensor !== undefined) {
                    units = data.sensor.units;
                }

                return f(d) + units;
            }

            // TOOL-TIPS
            // Tooltip container
            const tooltip = newChart.append("g")
                .style("display", "none");

            // Tooltip helper
            const bisectDate = d3.bisector(function(d) {
                return d.created;
            }).left;

            // Y-axis line for tooltip
            const yLine = tooltip.append("g")
                .append("line")
                .attr("class", "tooltip-line")
                .style("stroke", "blue")
                .style("stroke-dasharray", "3,3")
                .style("opacity", 0.5)
                .attr("y1", margin.bottom)
                .attr("y2", height);


            // Date text
            const timeText = tooltip.append("text")
                .attr("x", 0)
                .attr("y", margin.top - 5)
                .attr("width", 100)
                .attr("height", 100 * 0.4)
                .attr("fill", "black");

            // Drag behaivors for the selection box.
            // const dragStart = 0, dragStartPos = 0, dragEnd = 0;
            // const drag = d3.drag()
            //     .on("drag", function(d,i) {
            //         const x0 = xScale.invert(d3.mouse(this)[0]);
            //         i = bisectDate(data.readings, x0, 1);
            //         const d0 = data.readings[i - 1],
            //             d1 = data.readings[i];
            //         d = x0 - d0.created > d1.created - x0 ? d1 : d0;

            //         if(xScale(d.created) > dragStartPos){
            //             selectionBox.attr("width", (xScale(d.created) - dragStartPos));
            //         } else {
            //             selectionBox.attr("width", ( dragStartPos - xScale(d.created)));
            //             selectionBox.attr("transform", "translate(" + xScale(d.created) + ",0)" );
            //         }
            //     })
            //     .on("end", function(d,i){
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
            const circleElements = [],
                lineElements = [],
                textElements = [];

            function mousemove() {
                const x0 = xScale.invert(d3.mouse(this)[0]), // jshint ignore:line
                    i = bisectDate(data.readings, x0, 1),
                    d0 = data.readings[i - 1],
                    d1 = data.readings[i];
                if (d1 === undefined) {
                    return;
                }
                const d = x0 - d0.created > d1.created - x0 ? d1 : d0;

                circleElements[0].attr("transform", "translate(" + xScale(d.created) + "," + yScale(d.value) + ")");
                yLine.attr("transform", "translate(" + xScale(d.created) + "," + 0 + ")");
                lineElements[0].attr("transform", "translate(" + 0 + "," + yScale(d.value) + ")"); //uncomment this line for update of horizontal line tooltip
                timeText.text(new Date(d.created));

                textElements[0]
                    .text(getFormattedText(d.value))
                    .attr("transform", "translate(" + (xScale(d.created) + 10) + "," + (yScale(d.value) - 10) + ")");
            }

            // Selection box
            const selectionBox = newChart.append("rect")
                .attr("fill", "none")
                .attr("opacity", 0.5)
                .attr("x", 0)
                .attr("y", margin.top)
                .attr("width", 14)
                .attr("height", height - margin.top);

            // Hit area for selection box
            newChart.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .on("mouseover", function() {
                    tooltip.style("display", null);
                })
                .on("mouseout", function() {
                    tooltip.style("display", "none");
                })
                .on("mousemove", mousemove)
                .on("mousedown", function() {
                    selectionBox.attr("fill", "#b7ff64");
                    // dragStart = d3.mouse(this)[0];

                    const x0 = xScale.invert(d3.mouse(this)[0]),
                        i = bisectDate(data.readings, x0, 1),
                        d0 = data.readings[i - 1],
                        d1 = data.readings[i],
                        d = x0 - d0.created > d1.created - x0 ? d1 : d0;
                    selectionBox.attr("transform", "translate(" + xScale(d.created) + ",0)");
                    // dragStartPos = xScale(d.created);
                });
            // .call(drag);

            // Y Axis
            function getTic() {
                const Ticks = [];
                const ratio = (max - min) / 6;
                for (let i = 0; i < 7; i++) {
                    Ticks.push(min + (ratio * i));
                }
                return Ticks;
            }

            const yAxis = d3.axisLeft(yScale)
                .tickSizeInner(-width)
                .tickSizeOuter(0)
                .tickValues(getTic())
                .tickFormat(function(d) {
                    const f = d3.format(".1f");
                    return f(d) + " " + data.sensor.units;
                });

            newChart.append("g")
                .attr("class", "ChartAxis-Shape")
                .call(yAxis);

            // X Axis
            const xAxis = d3.axisBottom(xScale)
                .tickSizeInner(-height + margin.bottom)
                .tickSizeOuter(0)
                .tickPadding(10)
                .ticks(5);

            newChart.append("g")
                .attr("class", "ChartAxis-Shape")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            // Top border
            newChart.append("g")
                .append("line")
                .attr("class", "ChartAxis-Shape")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", margin.bottom)
                .attr("y2", margin.bottom);

            // Right border
            newChart.append("g")
                .append("line")
                .attr("class", "ChartAxis-Shape")
                .attr("x1", width)
                .attr("x2", width)
                .attr("y1", margin.bottom)
                .attr("y2", height);

            // Graph title
            newChart.append("text")
                .attr("class", "ChartTitle-Text")
                .attr("x", 0)
                .attr("y", 0)
                .text(data.sensor.name);

            // Legend
            const colors = ["#FFB90F", "#62f1ff", "blue", "red", "green", "yellow", ];

            // Legend text
            newChart.append("text")
                .attr("class", "ChartLegend-Text")
                .style("text-anchor", "end")
                .attr("x", width - 18)
                .attr("y", 10)
                .text(data.sensor.name);

            // Legend icon
            newChart.append("rect")
                .attr("fill", colors[i])
                .attr("x", width - 16)
                .attr("y", 0)
                .attr("width", 14)
                .attr("height", 14);

            //Graph lines
            const lineFunction = d3.line()
                .defined(function() {
                    // TODO: add linebreak behaivor
                    return true;
                })
                .x(function(d) {
                    return xScale(d.created);
                })
                .y(function(d) {
                    return yScale(d.value);
                });

            newChart.append("path")
                .attr("d", lineFunction(data.readings))
                .attr("stroke", colors[0])
                .attr("stroke-width", 2)
                .attr("fill", "none");

            // Tooltip circle
            const newCircle = tooltip.append("circle")
                .attr("class", "tooltip-circle")
                .style("fill", "none")
                .style("stroke", "blue")
                .attr("r", 4);
            circleElements.push(newCircle);

            // Use if horizontal lines are desired, uncomment line in mousemove() to get correct positioning
            const newLine = tooltip.append("line")
                .attr("class", "tooltip-line")
                .style("stroke", "blue")
                .style("stroke-dasharray", "3,3")
                .style("opacity", 0.5)
                .attr("x1", 0)
                .attr("x2", width);
            lineElements.push(newLine);
            // Tooltip text
            newText = tooltip.append("text")
                .attr("width", 100 * 2)
                .attr("height", 100 * 0.4)
                .attr("fill", "black");
            textElements.push(newText);
        } ///End D3

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

            apiService.get('reading/?sensor=' + dataService.selection() + "&start=" + start + "&end=" + end)
                .then(function successCallback(response) {
                    DrawGraph(response.data);
                }, function errorCallback(response) {
                    console.log("An error has occured.", response.data);
                });
        }

        $timeout(function() {
            $('#start_date').datetimepicker();
            $('#end_date').datetimepicker();
        });

        $scope.SubmitDate = function() {
            const newDates = {
                'start': $('#start_date').data("DateTimePicker").date(),
                'end': $('#end_date').data("DateTimePicker").date(),
            };
            $timeout(function() {
                $scope.$apply(function() {
                    $location.search('start_date', newDates.start === null ? undefined : newDates.start.unix());
                    $location.search('end_date', newDates.end === null ? undefined : newDates.end.unix());
                    GetGraph();
                });
            });
        };

        const sensorAttrs = [{
            'name': "name",
            'type': 'text',
            'value': 'default name',
            'id': 'modal_name',
            'fieldName': 'name',
        }, {
            'name': "description",
            "type": "text",
            'value': "default description",
            'id': 'modal_description',
            'fieldName': 'description',
        }, {
            'name': "coefficients",
            "type": "text",
            'value': "1,0",
            'id': 'modal_coefficients',
            'fieldName': 'coefficients',
        }, {
            'name': "self_type",
            'type': 'multiple',
            'value': [{
                'name': 'temperature',
            }, {
                'name': 'cleanliness',
            }, {
                'name': 'lightsensor',
            }, {
                'name': 'lightswitch',
            }, ],
            'id': 'modal_type',
            'fieldName': 'sensor_type',
        }, {
            'name': "units",
            "type": "text",
            'value': "default unit",
            'id': 'modal_unit',
            'fieldName': 'units',
        }, {
            'name': "Min Value",
            "type": "text",
            'value': 0,
            'id': 'modal_min',
            'fieldName': 'min_value',
        }, {
            'name': 'Max Value',
            'type': 'text',
            'value': 1024,
            'id': 'modal_max',
            'fieldName': 'max_value',
        }, {
            'name': 'Station',
            'type': 'text',
            'value': 'not set',
            'id': 'station',
            'fieldName': 'station',
        }, ];

        const readingAttrs = [{
            'name': "Sensor",
            "type": "multiple",
            'value': [],
            'id': 'modal_sensor',
            'fieldName': 'sensor',
        }, {
            'name': "value",
            "type": "text",
            'value': 7,
            'id': 'modal_value',
            'fieldName': 'value',
        }, {
            'name': "date",
            "type": "date",
            'value': 1000000,
            'id': 'modal_date',
            'fieldName': 'created',
        }, ];

        $timeout(function() {
            const sensors = dataService.data();
            sensors.forEach((i) => {
                readingAttrs[0].value.push({
                    'name': i.name,
                });
            });
        });

        const logAttrs = [{
            'name': "title",
            'type': 'text',
            'value': 'default log title',
            'id': 'modal_title',
            'fieldName': 'title',
        }, {
            'name': "description",
            "type": "text",
            'value': "default description",
            'id': 'modal_description',
            'fieldName': 'description',
        }, {
            'name': "date",
            "type": "date",
            'value': 1000000,
            'id': 'modal_date',
            'fieldName': 'created',
        }, ];

        $scope.OpenModal = function(type) {
            let attrs;
            $scope.isSensorModal = false;
            $scope.saveText = "Save " + type;
            $scope.modalTitle = type;
            switch (type) {
                case "sensor":
                    attrs = sensorAttrs;
                    $scope.isSensorModal = true;
                    break;
                case "reading":
                    attrs = readingAttrs;
                    break;
                case "log":
                    attrs = logAttrs;
                    break;
            }
            $scope.modalAttributes = attrs;
            $("#sensorEditModal").modal('toggle');
            $('#modal_alert').css('display', 'hidden');
            $timeout(function() {
                $('#modal_date').datetimepicker();
            });
        };

        $scope.SubmitModal = function() {
            let attrs;
            let url;
            let data = {};
            switch ($scope.modalTitle) {
                case "sensor":
                    attrs = sensorAttrs;
                    url = 'sensor';
                    break;
                case "reading":
                    data = {
                        'sensor': {
                            'name': $('#modal_sensor')[0].selectedOptions[0].innerText,
                        },
                        'readings': [{
                            'value': parseFloat($('#modal_value')[0].value),
                            'timestamp': $('#modal_date').data("DateTimePicker").date().unix(),
                        }, ],
                    };
                    url = 'reading';
                    break;
                case "log":
                    attrs = logAttrs;
                    url = 'log';
                    break;
            }
            if ($scope.modalTitle !== "reading") {
                attrs.forEach((i) => {
                    data[attrs[i].fieldName] = $('#' + attrs[i].id)[0].value;
                });
            } else {
                if (parseFloat(data.readings[0].value) < 2) {
                    console.log('err');
                    return;
                }
            }

            apiService.post(url, data).then(function successCallback(response) {
                console.log(response);
                $scope.LoggedIn = true;
                $("#sensorEditModal").modal('toggle');
            }, function errorCallback(response) {
                console.log("An error has occured.", response.data);
                $('#modal_alert').html(response.data.error);
                $('#modal_alert').css('display', 'block');
            }).then(function() {
                console.log('all done');
            });
        };

        $scope.$watch(function() {
            return dataService.selection();
        }, function(v) {
            if (v === undefined) {
                return;
            }
            if (dataService.data === undefined) {
                return;
            }
            GetGraph();
        });
    }, ]);
