/* eslint-disable id-length */
import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import {
  searchToObject,
  objectToString,
  windowEmitter,
  addOrUpdateHash,
} from '../utilities/Window';

const getReadings = (sensor, setReadings) => {
  const { start, end } = searchToObject();
  console.log(sensor);
  const kwargs = {
    sensorId: sensor.id,
  };
  if (start) {
    kwargs.start = start;
  }
  if (end) {
    kwargs.end = end;
  }

  fetch(`/api/reading?${objectToString(kwargs)}`)
    .then(res => res.json())
    .then(newReadings => {
      setReadings(
        newReadings
          .map(reading => ({ ...reading, timestamp: new Date(reading.timestamp) }))
          .sort((a, b) => a.timestamp - b.timestamp),
      );
    });
};

const Graph = ({ className, station, sensor }) => {
  const graphElement = useRef(null);
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    getReadings(sensor, setReadings);
    windowEmitter.listen('change', () => {
      getReadings(sensor, setReadings);
    });
  }, []);

  if (readings.length > 0 && graphElement.current) {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = graphElement.current.clientWidth - margin.left - margin.right;
    const height = graphElement.current.clientHeight - margin.top - margin.bottom;

    const xScale = d3
      .scaleTime()
      .range([0, width])
      .domain(d3.extent(readings, d => d.timestamp));

    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([d3.min(readings, d => d.value) - 5, d3.max(readings, d => d.value) + 5]);

    const valueline = d3
      .line()
      .x(d => xScale(d.timestamp))
      .y(d => yScale(d.value));

    const svg = d3
      .select(graphElement.current)
      .html('')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const tooltip = svg
      .append('g')
      .attr('class', 'tooltip')
      .attr('transform', `translate(${margin.left}, 0)`);

    // Tooltip line
    tooltip.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', height);

    // Tooltip circle
    tooltip.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 5);

    // Tooltip text
    tooltip.append('text');

    // Handle tooltip movement
    // non arrow function required here for 'this' scope
    d3.select('svg').on('mousemove', function () {
      const x0 = xScale.invert(d3.mouse(this)[0] - margin.left);
      let i = d3.bisector(d => d.timestamp).right(readings, x0, 1);
      // Prevents out of bounds exception
      if (i > readings.length - 1) {
        i = readings.length - 1;
      }

      tooltip
        .select('circle')
        .attr(
          'transform',
          `translate(${xScale(readings[i].timestamp) - margin.right}, ${yScale(
            readings[i].value,
          )})`,
        );

      tooltip
        .select('line')
        .attr('transform', `translate(${xScale(readings[i].timestamp) - margin.right}, 0)`);

      tooltip
        .select('text')
        .text(readings[i].value.toFixed(2))
        .attr(
          'transform',
          `translate(${xScale(readings[i].timestamp) - margin.right + 10}, ${yScale(
            readings[i].value,
          )})`,
        );
    });

    // Drag functions
    const selectionBox = svg
      .append('rect')
      .attr('fill', 'none')
      .attr('opacity', 0.5)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 14)
      .attr('height', height);

    let dragStart = 0;
    let dragStartPos = 0;
    let dragEnd = 0;
    const drag = d3
      .drag()
      .on('drag', function (d, i) {
        const x0 = xScale.invert(d3.mouse(this)[0]);
        let index = d3.bisector(datum => datum.timestamp).right(readings, x0, 1);
        // Prevents out of bounds exception
        if (i > readings.length - 1) {
          index = readings.length - 1;
        }

        if (xScale(readings[index].timestamp) - margin.left > dragStartPos + margin.right) {
          selectionBox.attr(
            'width',
            xScale(readings[index].timestamp) - dragStartPos - margin.left,
          );
        } else {
          selectionBox.attr(
            'width',
            dragStartPos + margin.left - xScale(readings[index].timestamp),
          );
          selectionBox.attr(
            'transform',
            `translate(${xScale(readings[index].timestamp) - margin.left},0)`,
          );
        }
      })
      .on('end', function (d, i) {
        dragEnd = d3.mouse(this)[0] - margin.right;
        if (Math.abs(dragStart - dragEnd) < 10) return;

        const x0 = xScale.invert(dragStart);
        const x1 = xScale.invert(dragEnd);

        if (x1 > x0) {
          addOrUpdateHash({ start: x0.toISOString(), end: x1.toISOString() });
        } else {
          addOrUpdateHash({ start: x1.toISOString(), end: x0.toISOString() });
        }
      });

    d3.select('svg')
      .on('mousedown', function () {
        selectionBox.attr('fill', '#b7ff64');
        dragStart = d3.mouse(this)[0] - margin.right;

        let index = d3
          .bisector(datum => datum.timestamp)
          .right(readings, xScale.invert(dragStart), 1);
        // Prevents out of bounds exception
        if (index > readings.length - 1) {
          index = readings.length - 1;
        }
        selectionBox.attr('transform', `translate(${xScale(readings[index].timestamp)},0)`);
        dragStartPos = xScale(readings[index].timestamp);
      })
      .call(drag);

    // Bottom axis
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y-%m-%d')));

    // Left axis
    svg
      .append('line')
      .attr('x1', 0.5)
      .attr('y1', 0)
      .attr('x2', 0.5)
      .attr('y2', height)
      .attr('stroke', 'currentcolor');

    // Left axis ticks
    svg
      .append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale).tickSize(width - margin.left - margin.right))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('x2', width).attr('class', 'tick-line'))
      .call(g => g.selectAll('.tick text').attr('x', -4));

    // Right axis
    svg
      .append('line')
      .attr('x1', width + 0.5)
      .attr('y1', 0)
      .attr('x2', width + 0.5)
      .attr('y2', height)
      .attr('stroke', 'currentcolor');

    // Top axis
    svg
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0.5)
      .attr('x2', width + 0.5)
      .attr('y2', 0.5)
      .attr('stroke', 'currentcolor');

    // Line graph
    svg.append('path').data([readings]).attr('class', 'line').attr('d', valueline);
  }

  return (
    <div ref={graphElement} className={className}>
      <div id="my-svg"> </div>
    </div>
  );
};

Graph.propTypes = {
  className: PropTypes.string.isRequired,
  station: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  sensor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

const styledGraph = styled(Graph)`
  width: 100%;
  height: 600px;
  background: white;

  .line {
    fill: none;
    stroke: #ffab00;
    stroke-width: 1.5px;
  }

  .tick-line {
    color: grey;
  }

  .tooltip {
    line {
      stroke: #3f94ff;
    }

    circle {
      stroke: #3f94ff;
      fill: none;
      stroke-width: 1;
    }
    text {
      stroke: #3f94ff;
    }
  }
`;

export default styledGraph;
