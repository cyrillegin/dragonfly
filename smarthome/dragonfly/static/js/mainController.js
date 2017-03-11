'use strict';

angular.module('dragonfly.maincontroller', ['googlechart'])

.controller("mainController",['$scope', '$timeout', '$http', '$window', 'apiService', function ($scope, $timeout, $http, $window, apiService) {

    var switchids = []
    $scope.graphIndex = 0;

    function GetData(){
      var req = {
        method: 'GET',
        url: 'dragonfly/getReadings',
        data: {}
      };
      $http(req).then(function successCallback(response){
        console.log(response)
        var info = response.data
        $scope.sensors = info;
        $scope.lightSwitchCharts = [];
        $scope.tempCharts = [];
        $scope.graphs = [];
        for(var i in info){
          console.log(info[i])
          if(info[i].self_type === "lightswitch"){
            console.log("here")
            DrawLightSwitch(info[i]);
          } else {
              DrawTempChart(info[i]);
          }
          if(info[i].readings.length < 3) continue;
          DrawLineChart(info[i]);
        }
      }, function errorCallback(response){
        console.log("An error has occured.", response.data);
      }).then(function(){
        $timeout(function(){
          for(var i in switchids){
            PostLoad();
          }
        }, 500);
      });
    }

    function PostLoad(){
      //node tree
      var sensorNodes = {
        "name": "Sensors",
        "children": []
      }
      for(i in $scope.sensors){
        sensorNodes.children.push({
          "name": i
        })
      }
      buildTree(sensorNodes);

      //bootstrap switches
      for(var i in switchids){
        $('#'+switchids[i]).bootstrapSwitch();
        $('#'+switchids[i]).on('switchChange.bootstrapSwitch', function(event, state){
          var req = {
            method: 'POST',
            url: "dragonfly/sendData",
            data: {
                "lightswitch": event.target.id.split('-')[1],
                "value": state
            }
          };

          $http(req).then(function successCallback(response){
            console.log("we got a good response!");
            console.log(response);
          }), function errorCallback(response){
             console.log("An error has occured.", response.data);
          };
        });
      }

      //clean chart drawings
      for(var i in $scope.cleanCharts){
        var cx = document.querySelector("#"+$scope.cleanCharts[i].id).getContext("2d");
        cx.beginPath();
        cx.moveTo(35, 0);
        cx.lineTo(35, 50);

        cx.lineTo(0, 100);
        cx.lineTo(5, 110);
        cx.lineTo(95, 110);
        cx.lineTo(100,100);

        cx.lineTo(65, 50);
        cx.lineTo(65, 0);
        
        // cx.fillStyle = "rgb(68, 191, 255)" //use this to change the color
        cx.fill();
      }
    }

//Buttons
    $scope.SelectSensor = function(id){
      var j = 0;
      for(var i in $scope.sensors){

        if($scope.sensors[i].name === id[0]){
          console.log("sensor found")
          console.log(j)
          $scope.graphIndex = j;
          $scope.selectedSensor = $scope.sensors[i];
        }
        j++;
      }
    };

    $scope.SubmitSensor = function(){
      var params = {
          "name": $scope.newSensorName,
          "description": $scope.newSensorDesc,
          "coefficients": $scope.newSensorType,
          "sensor_type": $scope.newSensorUnits,
          "units": $scope.newSensorCoef
      }
      if(params.name === "" || params.name === undefined){
        console.log("warning");
        return;
      }
      SendData('dragonfly/addSensor', params, GetData)

    };

    $scope.SubmitReading = function(){
      var params = {
          "value": $scope.newReadingValue,
          "date": $scope.newReadingDate,
          "sensor": $scope.selectedSensor.name
      }
      if(params.value === "" || params.value === undefined || params.date === "" || params.date === undefined){
        console.log("warning");
        return;
      }
      SendData('dragonfly/addReading', params, GetData) 
    }

//Utility

function SendData(newurl, params, callback){
  var req = {
    method: 'POST',
    url: newurl,
    data: params
  };

  $http(req).then(function successCallback(response){
    console.log("we got a good response!");
    console.log(response);
    callback();
  }), function errorCallback(response){
     console.log("An error has occured.", response.data);
  };
}
//Chart drawing
    function DrawCleanChart(data){
      var cleanObj = {
        "title": data.name,
        "id": "clean-" + data.id,
        "reading": data.readings[data.readings.length-1].value.toFixed(3)
      }
      $scope.cleanCharts.push(cleanObj);
    }

    function DrawLightSenseChart(data){
      var myObj = {
        "title": data.name,
        "id": "light-"+data.id,
        "reading": data.readings[data.readings.length-1].value.toFixed(3)
      }
      $scope.lightSensorCharts.push(myObj);
    }

    function DrawLightSwitch(data){
      var switchObj = {
        "title": data.name,
        "id": "switch-"+data.id
      }
      $scope.lightSwitchCharts.push(switchObj);
      switchids.push("switch-"+data.id);
    }

    function DrawTempChart(data){
      if(data.readings[data.readings.length-1] === undefined) return;
      var myChartObject = {}; 
      myChartObject.type = "Gauge"
      myChartObject.data = [
          ['Label', 'Value'],
          [data.name, data.readings[data.readings.length-1].value]
      ];

      myChartObject.options = {
          width: 400, height: 120,
          yellowFrom: 0, yellowTo: 55, yellowColor: '#4286f4',
          greenFrom: 55, greenTo: 80, greenColor: '#0cff2d',
          redFrom: 80, redTo: 120, redColor: '#ff0c0c',
          minorTicks: 5
      };

      $scope.tempCharts.push(myChartObject)
    }
   
   function DrawLineChart(data){
        var myChartObject = {};  

        myChartObject.type = "LineChart";

        myChartObject.data = [
          ['Time', 'Value']
        ]

        var vals = data.coefficients.split(",")
        var coef = {'x':1, 'y':0}
        // var coef = {
        //   'x': parseInt(vals[0][1]),
        //   'y': parseInt(vals[1][0])
        // }

        for(var i in data.readings){
          var value = data.readings[i].value * coef.x + coef.y; 
          myChartObject.data.push([new Date(data.readings[i].created), value])
        }

        myChartObject.options = {
            displayAnnotations: true,
            'title': data.name
        };

        $scope.graphs.push(myChartObject)
    }

    GetData();



    function buildTree(flare){
      var d3 = $window.d3;
      var margin = {top: 20, right: 120, bottom: 20, left: 120},
      width = 960 - margin.right - margin.left,
      height = 400 - margin.top - margin.bottom;

      var i = 0,
          duration = 750,
          root;

      var tree = d3.layout.tree()
          .size([height, width]);

      var diagonal = d3.svg.diagonal()
          .projection(function(d) { return [d.x, d.y]; });

      var svg = d3.select("#sensor-tree").append("svg")
          .attr("width", width + margin.right + margin.left)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        root = flare;
        root.x0 = height / 2;
        root.y0 = 0;

        function collapse(d) {
          if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
          }
        }

        root.children.forEach(collapse);
        update(root);
      

      d3.select(self.frameElement).style("height", "400px");

      function update(source) {

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 100; });

        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
            .on("click", click);

        nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        nodeEnter.append("text")
            .attr("x", -20)
            .attr("y", function(d) { return d.children || d._children ? -15 : 15; })
            // .attr("dx", ".35em")
            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.name; })
            .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
              var o = {x: source.x0, y: source.y0};
              return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
              var o = {x: source.x, y: source.y};
              return diagonal({source: o, target: o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });
        console.log($scope)
      }

      // Toggle children on click.
      function click(d) {
        var j = 0;
        for(var i in $scope.sensors){
          if($scope.sensors[i].name === d['name']){
            console.log("sensor found")
            console.log(j)
            $scope.graphIndex = j;
            $scope.selectedSensor = $scope.sensors[i];
          }
          j++;
        }
        $scope.$apply()

      }
    }

 
}]);
