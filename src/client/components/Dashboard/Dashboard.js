import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Graph from '../../charts/Graph';

const Dashboard = ({ className, stations }) => {
  console.log('dash');

  return (
    <div className={className}>
      {stations.map(station => (
        <div className="station" key={station.id}>
          {station.sensors.map(sensor => (
            <div className="sensor" key={sensor.id}>
              <Graph station={station} sensor={sensor} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

Dashboard.propTypes = {
  className: PropTypes.string.isRequired,
  stations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      health: PropTypes.oneOf(['healthy', 'unhealthy']),
      sensors: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          health: PropTypes.oneOf(['healthy', 'unhealthy']),
        }),
      ),
    }),
  ).isRequired,
};

const styledDashboard = styled(Dashboard)`
  position: absolute;
  left: 400px;
  padding: 2rem;
`;

export default styledDashboard;
