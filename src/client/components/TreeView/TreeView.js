import React, { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { addOrUpdateHash, removeFromHash } from '../../utilities/Window';

const TreeView = ({ className, stations }) => {
  const [stationSelected, setStation] = useState('');
  const [selection, setSelection] = useState('');

  const handleSelection = (type, id) => {
    const select = `${type}-${id}`;
    setSelection(select);

    if (type === 'station') {
      setStation(id);
      removeFromHash('sensor');
      addOrUpdateHash('station', select);
    } else {
      addOrUpdateHash('sensor', select);
    }
  };

  return (
    <div className={className}>
      {stations.map(station => (
        <div key={station.id}>
          <div
            className={`station ${selection === `station-${station.id}` ? 'selected' : ''}`}
            onClick={() => handleSelection('station', station.id)}
          >
            <div className={`${station.health}`} />
            <div className="station-title">{station.name}</div>
          </div>
          {stationSelected === station.id &&
            station.sensors.map(sensor => (
              <div
                key={sensor.id}
                className={`sensor ${selection === `sensor-${sensor.id}` ? 'selected' : ''}`}
                onClick={() => handleSelection('sensor', sensor.id)}
              >
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
  stations: [],
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
