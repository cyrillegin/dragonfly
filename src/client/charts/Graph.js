import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { searchToObject, objectToString, windowEmitter } from '../utilities/Window';

const Graph = ({ className, station, sensor }) => {
  const graphElement = useRef(null);
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    const getReadings = () => {
      const search = searchToObject();
      const kwargs = {
        start: search.start,
        end: search.end,
        sensorId: sensor.id,
      };
      fetch(`/api/readings?${objectToString(kwargs)}`)
        .then(res => res.json())
        .then(newReadings => {
          setReadings(
            newReadings.map(reading => ({ ...reading, timestamp: new Date(reading.timestamp) })),
          );
        });
    };

    getReadings();
    windowEmitter.listen('change', () => {
      getReadings();
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

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y-%m-%d')));

    svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScale));

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
  height: 100%;
  background: red;

  .line {
    fill: none;
    stroke: #ffab00;
    stroke-width: 3;
  }
`;

export default styledGraph;
