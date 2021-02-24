/* eslint-disable id-length */
import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { searchToObject, objectToString, addOrUpdateHash } from '../utilities/Window';
import Store from '../utilities/Store';
import Loader from '../components/Loader';

const coefOrder = [
  (value, coef) => value + coef,
  (value, coef) => value * coef,
  (value, coef) => value ** coef,
];

const getReadings = (sensor, setReadings, setLoading) => {
  setLoading(true);
  const search = searchToObject();
  const kwargs = {
    sensorId: sensor.id,
  };
  if (search.start) {
    kwargs.start = search.start;
  }
  if (search.end) {
    kwargs.end = search.end;
  }

  const coefParts = (sensor.coefficients || '0').split(',').map(e => parseFloat(e));

  fetch(`/api/reading?${objectToString(kwargs)}`)
    .then(res => res.json())
    .then(newReadings => {
      setReadings(
        newReadings
          .map(reading => ({
            value: coefParts.reduce(
              (cur, acc, index) => Number.parseFloat(coefOrder[index](cur, coefParts[index])).toPrecision(4),
              reading.value,
            ),
            timestamp: new Date(reading.timestamp),
          }))
          // Sorting is redundant as it takes place in the db,
          // leaving here though just in case :)
          .sort((a, b) => a.timestamp - b.timestamp),
      );
      setLoading(false);
    });
};

const Graph = ({ className, name, sensor, renderTrigger }) => {
  const graphElement = useRef(null);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setDate] = useState(null);

  useEffect(() => {
    getReadings(sensor, setReadings, setLoading);
    Store.listen('refresh', () => {
      getReadings(sensor, setReadings, setLoading);
    });
  }, [sensor, renderTrigger]);

  useEffect(() => {
    Store.listen('collapse', () => {
      setTimeout(() => {
        setDate(new Date());
      }, 600);
    });
  });

  if (graphElement.current) {
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
      .domain([d3.min(readings, d => d.value), d3.max(readings, d => d.value)]);

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

    // Bottom axis
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(width > 700 ? 10 : 5)
          .tickFormat(d3.timeFormat('%Y-%m-%d')),
      );

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

    // Left axis title
    if (sensor.unit) {
      svg
        .append('text')
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 20)
        .attr('x', -height / 2)
        .text(sensor.unit);
    }

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

    // Title
    let title = `${name} - ${sensor.name}`;
    const titleElem = svg.append('text').attr('class', 'graph-title');
    titleElem.text(title);

    if (readings.length === 0) {
      if (!loading) {
        // No readings text
        svg
          .append('text')
          .text('No readings exist in this range :(')
          .attr('text-anchor', 'middle')
          .attr('transform', `translate(${width / 2},${height / 2})`);
      }

      return (
        <div className={className}>
          <div ref={graphElement} className="graph-container">
            <div id="my-svg"> </div>
          </div>
          {loading && <Loader />}
        </div>
      );
    }

    const tooltip = svg
      .append('g')
      .attr('class', 'tooltip')
      .attr('transform', `translate(${margin.left}, 0)`)
      .attr('display', 'none');

    // Tooltip line
    tooltip.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', height);

    // Tooltip circle
    tooltip.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 5);

    // Tooltip text
    tooltip.append('text');

    // Handle tooltip movement
    // non arrow function required here for 'this' scope
    d3.select('svg').on('mousemove', event => {
      const x0 = xScale.invert(d3.pointer(event)[0] - margin.left);
      let i = d3.bisector(d => d.timestamp).right(readings, x0, 1);
      // Prevents out of bounds exception
      if (i > readings.length - 1) {
        i = readings.length - 1;
      }

      const ts = readings[i].timestamp;
      const dateString = `${ts.getMonth()}/${ts.getDate()} - ${ts.getHours()}:${ts.getMinutes()}`;
      title = `${name} - ${sensor.name} - ${dateString}`;
      titleElem.text(title);

      tooltip.attr('display', 'inline');

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
        .text(`${readings[i].value.toFixed(2)} ${sensor.unit}`)
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
      .on('drag', (event, d) => {
        const x0 = xScale.invert(d3.pointer(event)[0]);
        const index = d3.bisector(datum => datum.timestamp).right(readings, x0, 1);

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
      .on('end', (event, d) => {
        dragEnd = d3.pointer(event)[0] - margin.right;
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
      .on('mousedown', (event, d) => {
        selectionBox.attr('fill', '#b7ff64');
        dragStart = d3.pointer(event)[0] - margin.right;

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

    d3.select('svg').on('mouseleave', () => {
      title = `${name} - ${sensor.name}`;
      titleElem.text(title);
      tooltip.attr('display', 'none');
    });
  }

  return (
    <div className={className}>
      <div ref={graphElement} className="graph-container">
        <div id="my-svg"> </div>
      </div>
      {loading && <Loader />}
    </div>
  );
};

Graph.propTypes = {
  className: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  sensor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    unit: PropTypes.string,
  }).isRequired,
  /* This is used for the dashboard component to cause a
   * re-fetching of readings. Possible reasons are:
   * - new sensor
   * - new start time
   * - new end time
   */

  renderTrigger: PropTypes.instanceOf(Date).isRequired,
};

const styledGraph = styled(Graph)`
  position: relative;

  background: white;

  .graph-container {
    width: 100%;
    height: 100%;
  }

  .graph-title {
    transform: translate(0, -8px);
  }

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
