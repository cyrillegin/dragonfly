'use strict';

angular.module('dragonfly.graphcontroller', [])

.controller("graphController",['$scope', 'dataService', '$window', '$http', function ($scope, dataService, $window, $http) {
  $scope.$watch(function(){
    return dataService.selection();
  }, function(v){
    if(v === undefined) return;
    if(dataService.data === undefined) return;

    var params = {
      "sensor": dataService.selection()
    }
    var req = {
      method: 'POST',
      url: 'dragonfly/getReadings',
      data: params
    };
    $http(req).then(function successCallback(response){
      DrawGraph(response.data);
    }, function errorCallback(response){
      console.log("An error has occured.", response.data);
    });

    
  });

  function DrawGraph(data){
// Initialization.
    var d3 = $window.d3;
    var container = $('#graph-container')
    
    var width = container[0].clientWidth, height = 400
    var margin = {top: 20, right: 10, bottom: 30, left: 40};
    width = width - margin.left - margin.right; height = height - margin.top - margin.bottom;
    var i, j, newText;
    
// Apply calibration data.
    var coef = {"x": 1, "y": 0};

    for(i = 0; i < data.readings.length; i++){
        data.readings[i].created = new Date(data.readings[i].created).getTime()*1000;
        data.readings[i].value = data.readings[i].value*coef.x + coef.y;
    }
    
    var start = data.readings[0].created
    var end = data.readings[0].created;
    var min = data.readings[0].value;
    var max = data.readings[0].value;

// Set min and max values
    for(i = 0; i < data.readings.length;i++){
        if(min > data.readings[i].value) min = data.readings[i].value;
        if(max < data.readings[i].value) max = data.readings[i].value;
        if(start > data.readings[i].created) start = data.readings[i].created;
        if(end < data.readings[i].created) end = data.readings[i].created;
    }

// Create the svg.
    var newChart = d3.select('#graph-container')
        .append("svg")
        .attr("class", "Chart-Container")
        .attr("id", "Graph" + data.sensor.name)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")")
        .classed("svg-content-responsive", true);
    if(data.readings.length === 0){
        newChart.append("g").append("text")
            .text("No data exists for this time range.")
            .attr("class", "ChartTitle-Text")
            .attr("x", margin.left)
            .attr("y", height/2);
        return;
    }

// Scale
    var xScale = d3.scaleTime()
        .domain([new Date(start), new Date(end)])
        .rangeRound([0, width]);

    var yScale = d3.scaleLinear()
        .domain([min,max+(max-min)*0.1])
        .rangeRound([height, margin.bottom]);

// Y Axis
    var yAxis = d3.axisLeft(yScale)
        .tickSizeInner(-width)
        .tickSizeOuter(0)
        .tickValues(getTic())
        .tickFormat(function(d){
            var f = d3.format(".1f");
            return f(d) + " " + data.sensor.units;
        });

    function getTic(){
        var Ticks = [];
        var ratio  = (max-min) / 6;
        for(var i = 0; i < 7; i++){
            Ticks.push(min+(ratio*i));
        }
        return Ticks;
    }

    newChart.append("g")
        .attr("class", "ChartAxis-Shape")
        .call(yAxis);

// X Axis
    var xAxis = d3.axisBottom(xScale)
        .tickSizeInner(-height + margin.bottom )
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
    var colors = ["#FFB90F", "#62f1ff", "blue", "red", "green", "yellow"];

// Legend text
    var temp = newChart.append("text")
        .attr("class", "ChartLegend-Text")
        .style("text-anchor","end")
        .attr("x", width - 18)
        .attr("y", 10)
        .text(data.sensor.name);

// Legend icon
    newChart.append("rect")
        .attr("fill", colors[i])
        .attr("x", width-16)
        .attr("y", 0)
        .attr("width", 14)
        .attr("height", 14);
    

// Selection box
    var selectionBox = newChart.append("rect")
        .attr("fill", "none")
        .attr("opacity", 0.5)
        .attr("x",0)
        .attr("y", margin.top)
        .attr("width", 14)
        .attr("height", height-margin.top);
    

//Graph lines
    var lineFunction = d3.line()
        .x(function(d) {
            return xScale(d.created);
          })
        .y(function(d) {
            return yScale(d.value);
        });

    var lineGraph = newChart.append("path")
        .attr("d", lineFunction(data.readings))
        .attr("stroke", colors[0])
        .attr("stroke-width", 2)
        .attr("fill", "none");

// TOOL-TIPS
// Tooltip container
    var tooltip = newChart.append("g")
        .style("display", "none");
    var circleElements = [], lineElements = [], textElements = [];

// Tooltip circle
    var newCircle = tooltip.append("circle")
        .attr("class", "tooltip-circle")
        .style("fill", "none")
        .style("stroke", "blue")
        .attr("r", 4);
    circleElements.push(newCircle);

// Use if horizontal lines are desired, uncomment line in mousemove() to get correct positioning
    var newLine = tooltip.append("line")
        .attr("class", "tooltip-line")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("x1", 0)
        .attr("x2", width);
    lineElements.push(newLine);
// Tooltip text
    newText = tooltip.append("text")
        .attr("width", 100*2)
        .attr("height", 100*0.4)
        .attr("fill", "black");
    textElements.push(newText);

// Y-axis line for tooltip
    var yLine = tooltip.append("g")
        .append("line")
        .attr("class", "tooltip-line")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("y1", margin.bottom)
        .attr("y2", height);

// Date text
    var timeText = tooltip.append("text")
        .attr("x", 0)
        .attr("y", margin.top-5)
        .attr("width", 100)
        .attr("height", 100*0.4)
        .attr("fill", "black");

// Drag behaivors for the selection box.
    // var dragStart = 0, dragStartPos = 0, dragEnd = 0;
    // var drag = d3.drag()
    //     .on("drag", function(d,i) {
    //         var x0 = xScale.invert(d3.mouse(this)[0]);
    //         i = bisectDate(data.readings, x0, 1);
    //         var d0 = data.readings[i - 1],
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

    //         var x0 = xScale.invert(dragStart), x1 = xScale.invert(dragEnd);

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

// Hit area for selection box
    var circleHit = newChart.append("rect")
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
        .on("mousedown", function(){
            selectionBox.attr("fill", "#b7ff64");
            // dragStart = d3.mouse(this)[0];

            var x0 = xScale.invert(d3.mouse(this)[0]),
                i = bisectDate(data.readings, x0, 1),
                d0 = data.readings[i - 1],
                d1 = data.readings[i],
                d = x0 - d0.created > d1.created - x0 ? d1 : d0;
            selectionBox.attr("transform", "translate(" + xScale(d.created) + ",0)" );
            // dragStartPos = xScale(d.created);
        })
        // .call(drag);

// Tooltip helper
    var bisectDate = d3.bisector(function(d) {
        return d.created;
    }).left;

// Update loop for tooltips.
    function mousemove() {
        var x0 = xScale.invert(d3.mouse(this)[0]),
            i = bisectDate(data.readings, x0, 1),
            d0 = data.readings[i - 1],
            d1 = data.readings[i];
        if(d1 === undefined) return;
        var d = x0 - d0.created > d1.created - x0 ? d1 : d0;

        circleElements[0].attr("transform", "translate(" + xScale(d.created) + "," + yScale(d.value) + ")");
        yLine.attr("transform", "translate(" + xScale(d.created) + "," + 0 + ")");
        lineElements[0].attr("transform", "translate(" + 0 + "," + yScale(d.value) + ")"); //uncomment this line for update of horizontal line tooltip
        timeText.text(new Date(d.created));

        textElements[0]
            .text(getFormattedText(d.value))
            .attr("transform", "translate(" + (xScale(d.created)+10) + "," + (yScale(d.value)-10) + ")");
         
    }

// Formats text for units display
    function getFormattedText(d){
        var f = d3.format(".1f");
        var count = Math.round(d).toString().length;
        var units = "";
        if(data.sensor !== undefined){
            units = data.sensor.units;
        }
   
        f = d3.format(".1f");
        return f(d) + units;
        
     }

}///End D3




  
}]);