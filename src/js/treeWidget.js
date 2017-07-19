import * as d3 from 'd3';

export default class treeController {
    constructor($scope, $window, $http) {
        'ngInject';

        this.$scope = $scope;
        this.$window = $window;
        this.$http = $http;

        this.LoadSensors();
    }


    LoadSensors() {
        const sensorNodes = {
            name: 'Sensors',
            children: [],
        };

        this.$http.get('/api/sensor')
            .then(
                (response) => {
                    console.log(response);
                    response.data.sensor_list.forEach((i) => {
                        if (i.station === null) {
                            i.station = 'Not set';
                        }
                        let stationExists = false;
                        sensorNodes.children.forEach((j) => {
                            if (i.station === j.name) {
                                stationExists = true;
                            }
                        });
                        if (! stationExists) {
                            sensorNodes.children.push({
                                name: i.station,
                                children: [],
                            });
                        }
                        sensorNodes.children.forEach((j) => {
                            if (j.name === i.station) {
                                j.children.push({
                                    name: i.name,
                                });
                            }
                        });
                    });
                    this.buildTree(sensorNodes);
                },
                (response) => {
                    console.log('error');
                    return;
                });
    };


    buildTree(treeData) {
        // Set the dimensions and margins of the diagram
        const margin = {
            top: 30,
            right: 20,
            bottom: 20,
            left: 20,
        };
        const width = $('#sensor-tree')[0].clientWidth - margin.right - margin.left;
        const height = 170 - margin.top - margin.bottom;

        const svg = d3.select('#sensor-tree').append('svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        let i = 0;
        const duration = 750;

        // declares a tree layout and assigns the size
        const treemap = d3.tree().size([width, height]);

        // Assigns parent, children, height, depth
        const root = d3.hierarchy(treeData, (d) => {
            return d.children;
        });
        root.x0 = width / 2;
        root.y0 = 0;

        // Collapse the node and all it's children
        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }
        // Collapse after the second level
        root.children.forEach(collapse);

        function update(source) {
            // Assigns the x and y position for the nodes
            const treeData = treemap(root);

            // Compute the new tree layout.
            const nodes = treeData.descendants();
            const links = treeData.descendants().slice(1);

            // Normalize for fixed-depth.
            nodes.forEach((d) => {
                d.y = d.depth * 50;
            });

            // ****************** Nodes section ***************************

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
                if (d.children === undefined) {
                    // dataService.select(d.data.name);
                }
                $scope.$apply();
            }

            // Update the nodes...
            const node = svg.selectAll('g.node')
                .data(nodes, (d) => {
                    return d.id || (d.id = ++ i);
                });

            // Enter any new modes at the parent's previous position.
            const nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .attr('transform', () => {
                    return 'translate(' + source.x0 + ',' + source.y0 + ')';
                })
                .on('click', click);

            // Add Circle for the nodes
            nodeEnter.append('circle')
                .attr('class', 'node')
                .attr('r', 1e-6)
                .style('fill', (d) => {
                    return d._children ? 'lightsteelblue' : '#fff';
                });

            // Add labels for the nodes
            nodeEnter.append('text')
                .attr('y', (d) => {
                    return d.children || d._children ? - 14 : 20;
                })
                .attr('text-anchor', 'middle')
                .text((d) => {
                    return d.data.name;
                });

            // UPDATE
            const nodeUpdate = nodeEnter.merge(node);

            // Transition to the proper position for the node
            nodeUpdate.transition()
                .duration(duration)
                .attr('transform', (d) => {
                    return 'translate(' + d.x + ',' + d.y + ')';
                });

            // Update the node attributes and style
            nodeUpdate.select('circle.node')
                .attr('r', 10)
                .style('fill', (d) => {
                    return d._children ? 'lightsteelblue' : '#fff';
                })
                .attr('cursor', 'pointer');

            // Remove any exiting nodes
            const nodeExit = node.exit().transition()
                .duration(duration)
                .attr('transform', () => {
                    return 'translate(' + source.x + ',' + source.y + ')';
                })
                .remove();

            // On exit reduce the node circles size to 0
            nodeExit.select('circle')
                .attr('r', 1e-6);

            // On exit reduce the opacity of text labels
            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            // ****************** links section ***************************

            // Creates a curved (diagonal) path from parent to the child nodes
            function diagonal(source, target) {
                const d = {
                    source: source,
                    target: target,
                };
                return 'M' + d.source.x + ',' + d.source.y +
                    'C' + d.source.x + ',' +
                    (d.source.y + d.target.y) / 2 + ' ' + d.target.x + ',' +
                    (d.source.y + d.target.y) / 2 + ' ' + d.target.x + ',' +
                    d.target.y;
            }

            // Update the links...
            const link = svg.selectAll('path.link')
                .data(links, (d) => {
                    return d.id;
                });

            // Enter any new links at the parent's previous position.
            const linkEnter = link.enter().insert('path', 'g')
                .attr('class', 'link')
                .attr('d', () => {
                    const o = {
                        x: source.x0,
                        y: source.y0,
                    };
                    return diagonal(o, o);
                });

            // UPDATE
            const linkUpdate = linkEnter.merge(link);

            // Transition back to the parent element position
            linkUpdate.transition()
                .duration(duration)
                .attr('d', (d) => {
                    return diagonal(d, d.parent);
                });

            // Store the old positions for transition.
            nodes.forEach((d) => {
                d.x0 = d.x;
                d.y0 = d.y;
            });

        }
        update(root);
    }
}
