import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const TreeView = ({ className, stations }) => {
  const selection = '1';

  // selection based off of name wont work..
  return (
    <div className={className}>
      {stations.map(station => (
        <div className={`station ${selection === station.name ? 'selected' : ''}`}>
          <div className={`${station.health}`} />
          <div className="station-title">{station.name}</div>
          {selection === station.name &&
            station.sensors.map(sensor => (
              <div className={`sensor ${selection === sensor.name ? 'selected' : ''}`}>
                <div className={`status ${sensor.health}`} />
                <div className="sensor-title">{sensor.name}</div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

TreeView.propTypes = {
  className: PropTypes.string.isRequired,
  stations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      health: PropTypes.oneOf(['healthy', 'unhealthy']),
      sensors: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          health: PropTypes.oneOf(['healthy', 'unhealthy']),
        }),
      ),
    }),
  ),
};

TreeView.defaultProps = {
  stations: [
    {
      name: 'test',
      health: 'healthy',
      sensors: [
        {
          name: 'temperature',
          health: 'unhealthy',
        },
      ],
    },
  ],
};

const styledTreeView = styled(TreeView)`
  width: 400px;
  box-shadow: 14px 0px 10px -10px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 70px;
  bottom: -10;
  padding-left: 32px;
  padding-top: 32px;

  .station {
    &.selected {
    }

    &:hover {
      background: blue;
    }

    .healthy {
      width: 15px;
      height: 15px;
      background: green;
      border-radius: 10px;
      display: inline-block;
    }

    .unhealthy {
      width: 15px;
      height: 15px;
      background: red;
      border-radius: 10px;
      display: inline-block;
    }

    .station-title {
      font-size: 24px;
      margin-left: 16px;
      display: inline-block;
    }

    .sensor {
      &.selected {
      }

      .healthy {
        width: 15px;
        height: 15px;
        background: green;
        border-radius: 10px;
        display: inline-block;
      }

      .unhealthy {
        width: 15px;
        height: 15px;
        background: red;
        border-radius: 10px;
        display: inline-block;
      }

      .sensor-title {
        font-size: 16px;
        margin-left: 16px;
        display: inline-block;
      }
    }
  }
`;

export default styledTreeView;
