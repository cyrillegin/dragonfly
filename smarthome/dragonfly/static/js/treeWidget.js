'use strict';

angular.module('dragonfly.treecontroller', ['googlechart'])

.controller("treeController",['$scope', '$timeout', '$http', '$window', 'apiService', function ($scope, $timeout, $http, $window, apiService) {
    $scope.$watch('sensors', function(v){
        if(v !== undefined){
            var sensorNodes = {
                "name": "Sensors",
                "children": []
              }
              for(var i in $scope.sensors){
                sensorNodes.children.push({
                  "name": i
                })
              }
              buildTree(sensorNodes);
        }
    });


function buildTree(root){
      var d3 = $window.d3;
      var margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = $('#sensor-tree')[0].clientWidth - margin.right - margin.left,
      height = 100 - margin.top - margin.bottom;

      var i = 0,
          duration = 750,
          root;

      var tree = d3.layout.tree()
         .nodeSize([100, 40]);

      var diagonal = d3.svg.diagonal()
          .projection(function(d) { return [d.x, d.y]; });

      var svg = d3.select("#sensor-tree").append("svg")
          .attr("width", width + margin.right + margin.left)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + width/2 + "," + margin.top + ")");

        root.x0 = 0;
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
      
      function update(source) {

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 50; });

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
            .attr("y", function(d) { return d.children || d._children ? -8 : 20; })
            .attr("text-anchor", 'middle')
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
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
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