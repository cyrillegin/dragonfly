/*jslint node: true */
'use strict';
var angular, $, d3;
angular.module('dragonfly.gaugecontroller', [])

.controller("gaugeController",['$scope', 'dataService', '$timeout', '$interval', '$http', function ($scope, dataService, $timeout, $interval, $http) {

  $scope.gauges = [];

  $scope.$watch(function(){
    return dataService.data();
  }, function(v){
    if(v === undefined) return;
    for( var i in v){
      $scope.gauges.push({'id': 'gaugeChart-'+i});
    }

    $timeout(function(){
      for( var i in v){
         DrawTempChart(v[i], i);
      }
    }, 500);
  });

  var req = {
      method: 'GET',
      url: '/api/sensor'
    };
  var myInter = $interval(function(){
    $http(req).then(function successCallback(response){
        for(var i in $scope.gauges){
          redraw(i, response.data.sensor_list[i].lastReading, 100, $scope.gauges[i].config);
           
        }
    }, function errorCallback(response){
      console.log("An error has occured.", response.data);
    });
  },1000*60);

  function DrawTempChart(data, id){
    var config = {
      size: 90,
      label: data.name,
      min: data.min_value-data.min_value*0.2,
      max: data.max_value+data.min_value*0.2,
    };
    
    var range = config.max - config.min;
    config.yellowZones = [{ from: config.min , to: data.min_value }];
    config.redZones = [{ from: data.max_value , to: config.max }];
    config.greenZones = [{ from: data.min_value , to: data.max_value }];
     
    config.raduis = config.size * 0.97 / 2;
    config.cx = config.size / 2;
    config.cy = config.size / 2;
    
    config.range = config.max - config.min;
    
    config.majorTicks = 5;
    config.minorTicks =2;
    
    config.greenColor  = "#109618";
    config.yellowColor = "#FF9900";
    config.redColor = "#DC3912";
    
    config.transitionDuration = 500;
  
    var svg = d3.select("#gaugeChart-"+id)
        .append("svg:svg")
        .attr("class", "gauge")
        .attr("width", config.size)
        .attr("height", config.size);
    
    svg.append("svg:circle")
        .attr("cx", config.cx)
        .attr("cy", config.cy)
        .attr("r", config.raduis)
        .style("fill", "#ccc")
        .style("stroke", "#000")
        .style("stroke-width", "0.5px");
          
    svg.append("svg:circle")
        .attr("cx", config.cx)
        .attr("cy", config.cy)
        .attr("r", 0.9 * config.raduis)
        .style("fill", "#fff")
        .style("stroke", "#e0e0e0")
        .style("stroke-width", "2px");
          
    var index;
    for (index in config.greenZones){
      drawBand(config.greenZones[index].from, config.greenZones[index].to, config.greenColor);
    }
    
    for (index in config.yellowZones){
      drawBand(config.yellowZones[index].from, config.yellowZones[index].to, config.yellowColor);
    }
    
    for (index in config.redZones){
      drawBand(config.redZones[index].from, config.redZones[index].to, config.redColor);
    }
    var fontSize;
    if (undefined !== config.label){
      fontSize = Math.round(config.size / 9);
      svg.append("svg:text")
          .attr("x", config.cx)
          .attr("y", config.cy / 2 + fontSize / 2)
          .attr("dy", fontSize / 2)
          .attr("text-anchor", "middle")
          .text(config.label)
          .style("font-size", fontSize + "px")
          .style("fill", "#333")
          .style("stroke-width", "0px");
    }
    
    fontSize = Math.round(config.size / 16);
    var majorDelta = config.range / (config.majorTicks - 1);
    for (var major = config.min; major <= config.max; major += majorDelta){
      var minorDelta = majorDelta / config.minorTicks;
      var point1, point2;
      for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, config.max); minor += minorDelta){
        point1 = valueToPoint(minor, 0.75, config);
        point2 = valueToPoint(minor, 0.85, config);
        
        svg.append("svg:line")
            .attr("x1", point1.x)
            .attr("y1", point1.y)
            .attr("x2", point2.x)
            .attr("y2", point2.y)
            .style("stroke", "#666")
            .style("stroke-width", "1px");
      }
      
      point1 = valueToPoint(major, 0.7, config);
      point2 = valueToPoint(major, 0.85, config);  
      
      svg.append("svg:line")
          .attr("x1", point1.x)
          .attr("y1", point1.y)
          .attr("x2", point2.x)
          .attr("y2", point2.y)
          .style("stroke", "#333")
          .style("stroke-width", "2px");
      
      if (major == config.min || major == config.max){
        var point = valueToPoint(major, 0.63, config);
        
        svg.append("svg:text")
            .attr("x", point.x)
            .attr("y", point.y)
            .attr("dy", fontSize / 3)
            .attr("text-anchor", major == config.min ? "start" : "end")
            .text(major)
            .style("font-size", fontSize + "px")
            .style("fill", "#333")
            .style("stroke-width", "0px");
      }
    }
    
    var pointerContainer = svg.append("svg:g").attr("class", "pointerContainer");
    
    var midValue = (config.min + config.max) / 2;
    
    var pointerPath = buildPointerPath(midValue);
    
    var pointerLine = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .curve(d3.curveBasis);
    
    pointerContainer.selectAll("path")
        .data([pointerPath])
        .enter()
        .append("svg:path")
            .attr("d", pointerLine)
            .style("fill", "#dc3912")
            .style("stroke", "#c63310")
            .style("fill-opacity", 0.7);
          
    pointerContainer.append("svg:circle")
        .attr("cx", config.cx)
        .attr("cy", config.cy)
        .attr("r", 0.12 * config.raduis)
        .style("fill", "#4684EE")
        .style("stroke", "#666")
        .style("opacity", 1);
    
    fontSize = Math.round(config.size / 10);
    pointerContainer.selectAll("text")
        .data([midValue])
        .enter()
        .append("svg:text")
            .attr("x", config.cx)
            .attr("y", config.size - config.cy / 4 - fontSize)
            .attr("dy", fontSize / 2)
            .attr("text-anchor", "middle")
            .style("font-size", fontSize + "px")
            .style("fill", "#000")
            .style("stroke-width", "0px");

    var val = data.lastReading;
    redraw(id, val, 10, config);
  
    function buildPointerPath(value){
      var delta = config.range / 13;

      var head = valueToPoint(value - majorDelta, 0.85, config);
      var head1 = valueToPoint(value - delta, 0.12, config);
      var head2 = valueToPoint(value + delta, 0.12, config);

      
      var tailValue = value - (config.range * (1/(270/360)) / 2);
      var tail = valueToPoint(tailValue, 0.28, config);
      var tail1 = valueToPoint(tailValue - delta, 0.12, config);
      var tail2 = valueToPoint(tailValue + delta, 0.12, config);

      head = {'x': 0, 'y':0};
      tail = {'x': 30, 'y':30};

      
      return [head, tail];
      
      function valueToPoint(value, factor){
        var point = {'x': 0, 'y':0}; 
        point.x += value*factor;
        point.y += value*factor;
        return point;
      }
    }
  
    function drawBand(start, end, color){
      if (0 >= end - start) return;
      
      svg.append("svg:path")
        .style("fill", color)
        .attr("d", d3.arc()
          .startAngle(valueToRadians(start, config))
          .endAngle(valueToRadians(end, config))
          .innerRadius(0.65 * config.raduis)
          .outerRadius(0.85 * config.raduis))
          .attr("transform", function() { return "translate(" + config.cx + ", " + config.cy + ") rotate(270)";});
    }

    $scope.gauges[id].config = config;
  }
  function redraw(id, value, transitionDuration, config){

    var svg = d3.select("#gaugeChart-"+id);

    var pointerContainer = svg.select(".pointerContainer");
    
    pointerContainer.selectAll("text").text(Math.round(value));
    
    var pointer = pointerContainer.selectAll("path");
    pointer.transition()
        .duration(undefined !== transitionDuration ? transitionDuration : config.transitionDuration) 
        .attrTween("transform", function(){
            var pointerValue = value;
            
            if (value > config.max) pointerValue = config.max + 0.02*config.range;
            else if (value < config.min) pointerValue = config.min - 0.02*config.range;
            var targetRotation = (valueToDegrees(pointerValue, config) - 90);
            var currentRotation = this._currentRotation || targetRotation;
            this._currentRotation = targetRotation;
            
            return function(step) {
                var rotation = currentRotation + (targetRotation-currentRotation)*step;
                return "translate(" + config.cx + ", " + config.cy + ") rotate(" + (225+rotation) + ")"; 
            };
        });
    }

    function valueToDegrees(value, config){
      return value / config.range * 270 - (config.min / config.range * 270 + 45);
    }
    
    function valueToRadians(value, config){
      return valueToDegrees(value, config) * Math.PI / 180;
    }
    
    function valueToPoint(value, factor, config){
      return {  x: config.cx - config.raduis * factor * Math.cos(valueToRadians(value, config)),
            y: config.cy - config.raduis * factor * Math.sin(valueToRadians(value, config))    };
    }
}]);