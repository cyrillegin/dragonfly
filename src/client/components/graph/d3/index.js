const d3 = {
  ...require('d3-selection'),
  ...require('d3-scale'),
  ...require('d3-axis'),
  ...require('d3-format'),
  ...require('d3-shape'),
  ...require('d3-array'),
};

const buildD3 = readings => {
  console.log('building');
  console.log(readings);
  if (readings === undefined) {
    return;
  }
  // Initialization.
  const container = document.querySelector('#graph-root');

  d3.select('#graph-root')
    .select('svg')
    .remove();

  if (container.length < 3) {
    container.innerHTML = 'There arnt enough readings for this sensor to display anything.';
    return;
  }

  let width = container.clientWidth;
  let height = 400;
  const margin = {
    top: 10,
    right: 20,
    bottom: 10,
    left: 60,
  };
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  const dataObject = [];

  for (let i = 0; i < readings.length; i++) {
    dataObject.push({
      time: new Date(readings[i].timestamp),
      value: readings[i].value,
    });
  }
  console.log(dataObject);

  let end = dataObject[0].time;
  let start = dataObject[0].time;
  let min = dataObject[0].value;
  let max = dataObject[0].value;

  // Set min and max values
  for (let i = 0; i < dataObject.length; i++) {
    if (min > dataObject[i].value) {
      min = dataObject[i].value;
    }
    if (max < dataObject[i].value) {
      max = dataObject[i].value;
    }
    if (end < dataObject[i].time) {
      end = dataObject[i].time;
    }
    if (start > dataObject[i].time) {
      start = dataObject[i].time;
    }
  }
  // Adds margins within the graph
  min = min - (max - min) * 0.05;
  max = max + (max - min) * 0.05;
  start = new Date(start);
  end = new Date(end);

  console.log(min, max, start, end);

  // Create the svg.
  const newChart = d3
    .select('#graph-root')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.bottom})`)
    .classed('svg-content-responsive', true);

  // Scale
  const xScale = d3
    .scaleTime()
    .domain([new Date(start), new Date(end)])
    .rangeRound([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([min, max])
    .rangeRound([height - margin.bottom, margin.top]);

  // // Y Axis
  function getTic() {
    const Ticks = [];
    const ratio = (max - min) / 6;
    for (let q = 0; q < 7; q++) {
      Ticks.push(min + ratio * q);
    }
    return Ticks;
  }

  const yAxis = d3
    .axisLeft(yScale)
    .tickSizeInner(-width)
    .tickSizeOuter(0)
    .tickValues(getTic())
    .tickFormat(d => {
      const f = d3.format('.1f');
      return `${f(d)}`; // ${this.props.sensor.units}
    });

  newChart
    .append('g')
    .attr('class', 'chart-axis-shape')
    .call(yAxis);

  // X Axis
  const xAxis = d3
    .axisBottom(xScale)
    .tickSizeInner(-height + margin.bottom + margin.top)
    .tickSizeOuter(0)
    .tickPadding(10)
    .ticks(10);

  newChart
    .append('g')
    .attr('class', 'chart-axis-shape')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  // Top border
  newChart
    .append('g')
    .append('line')
    .attr('class', 'chart-axis-shape')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', margin.bottom)
    .attr('y2', margin.bottom);

  // Right border
  newChart
    .append('g')
    .append('line')
    .attr('class', 'chart-axis-shape')
    .attr('x1', width)
    .attr('x2', width)
    .attr('y1', margin.bottom)
    .attr('y2', height - margin.bottom);

  // Graph lines
  const lineFunction = d3
    .line()
    // .defined(() => {
    //     // TODO: add linebreak behaivor
    //     return true;
    // })
    .x(d => xScale(d.time))
    .y(d => yScale(d.value));

  newChart
    .append('path')
    .attr('d', lineFunction(dataObject))
    .attr('stroke', 'rgba(45, 100, 255, 0.87)')
    .attr('stroke-width', 2)
    .attr('fill', 'none');

  // TOOL-TIPS
  // Tooltip container
  const tooltip = newChart.append('g').style('display', 'none');

  // Tooltip helper
  const bisectDate = d3.bisector(d => d.time).left;

  // Formats text for units display
  const getFormattedText = d => {
    const f = d3.format('.1f');
    // const units = this.props.sensor.units;
    return f(d); // + units;
  };

  // Y-axis line for tooltip
  const yLine = tooltip
    .append('g')
    .append('line')
    .attr('class', 'tooltip-line')
    .style('stroke', 'blue')
    .style('stroke-dasharray', '3,3')
    .style('opacity', 0.5)
    .attr('y1', margin.bottom)
    .attr('y2', height);

  // Date text
  const timeText = tooltip
    .append('text')
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
  //         d = x0 - d0.time > d1.time - x0 ? d1 : d0;

  //         if(xScale(d.time) > dragStartPos){
  //             selectionBox.attr('width', (xScale(d.time) - dragStartPos));
  //         } else {
  //             selectionBox.attr('width', ( dragStartPos - xScale(d.time)));
  //             selectionBox.attr('transform', 'translate(' + xScale(d.time) + ',0)' );
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
  const textElements = [];

  function mousemove() {
    const x0 = xScale.invert(d3.mouse(this)[0]);

    const cross = bisectDate(dataObject, x0, 1);
    const d0 = dataObject[cross - 1];
    const d1 = dataObject[cross];
    if (d1 === undefined) {
      return;
    }
    const d = x0 - d0.time > d1.time - x0 ? d1 : d0;

    circleElements[0].attr('transform', `translate(${xScale(d.time)},${yScale(d.value)})`);
    yLine.attr('transform', `translate(${xScale(d.time)},0)`);
    timeText.text(new Date(d.time));

    textElements[0]
      .text(getFormattedText(d.value))
      .attr('transform', `translate(${xScale(d.time) + 10},${yScale(d.value) - 10})`);
  }

  // // Selection box
  // const selectionBox = newChart
  //   .append('rect')
  //   .attr('fill', 'none')
  //   .attr('opacity', 0.5)
  //   .attr('x', 0)
  //   .attr('y', margin.top)
  //   .attr('width', 14)
  //   .attr('height', height - margin.top);

  // Hit area for selection box
  newChart
    .append('rect')
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
    .on('mousemove', mousemove);
  //   .on('mousedown', () => {
  //     selectionBox.attr('fill', '#b7ff64');
  //     // dragStart = d3.mouse(this)[0];
  //
  //     const x0 = xScale.invert(d3.mouse(this)[0]);
  //     const cross = bisectDate(dataObject.readings, x0, 1);
  //     const d0 = dataObject.readings[cross - 1];
  //     const d1 = dataObject.readings[cross];
  //     const d = x0 - d0.time > d1.time - x0 ? d1 : d0;
  //     selectionBox.attr('transform', `translate(${xScale(d.time)},0)`);
  //     // dragStartPos = xScale(d.time);
  //   });
  // // .call(drag);

  // Tooltip circle
  const newCircle = tooltip
    .append('circle')
    .style('fill', 'none')
    .style('stroke', 'blue')
    .attr('r', 4);
  circleElements.push(newCircle);

  // Tooltip text
  const newText = tooltip
    .append('text')
    .attr('width', 100 * 2)
    .attr('height', 100 * 0.4)
    .attr('fill', 'black');
  textElements.push(newText);
};

export default buildD3;
