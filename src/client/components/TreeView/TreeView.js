import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { addOrUpdateHash, removeFromHash, searchToObject } from '../../utilities/Window';
import { AddStation, AddSensor, AddDashboard } from '../Modals';

const TreeView = ({ className, stations, dashboards }) => {
  const [stationSelected, setStation] = useState('');
  const [selection, setSelection] = useState('');
  const [modal, toggleModal] = useState('');
  const [availableStations, setAvailableStations] = useState([]);

  useEffect(() => {
    setAvailableStations(stations);
  }, [stations]);

  const [dashboardModal, toggleDashboardModal] = useState(false);

  useEffect(() => {
    const { station, sensor } = searchToObject();
    if (station) {
      setStation(parseInt(station.split('-')[1], 10));
      setSelection(station);
    }
    if (sensor) {
      setSelection(sensor);
    }
  }, [setStation, setSelection]);

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

  const handleAdd = type => {
    toggleModal(type);
  };

  const updateTree = (element, type) => {
    if (type === 'station') {
      setAvailableStations([element, ...availableStations]);
    } else if (type === 'sensor') {
      setAvailableStations([
        ...availableStations.map(station => {
          const sensors = [...station.sensors];
          if (station.id === element.stationId) {
            sensors.push(element);
          }
          return {
            ...station,
            sensors: [sensors],
          };
        }),
      ]);
    }
  };

  return (
    <div className={className}>
      {modal === 'AddStation' && (
        <AddStation close={() => toggleModal('')} updateTree={updateTree} />
      )}
      {modal === 'AddSensor' && (
        <AddSensor
          close={() => toggleModal('')}
          address={availableStations.filter(station => station.id === stationSelected)[0].address}
          port={availableStations.filter(station => station.id === stationSelected)[0].port}
          updateTree={updateTree}
        />
      )}
      {dashboardModal && (
        <AddDashboard
          stations={availableStations}
          close={() => toggleDashboardModal(false)}
          updateTree={updateTree}
        />
      )}
      <div className="section">Stations</div>
      {availableStations.map(station => (
        <div key={station.id}>
          <div
            className={`station ${selection === `station-${station.id}` ? 'selected' : ''}`}
            onClick={() => handleSelection('station', station.id)}
            onKeyDown={() => handleSelection('station', station.id)}
            role="button"
            tabIndex={0}
          >
            <div className={`${station.health}`} />
            <div className="station-title">{station.name}</div>
          </div>
          {stationSelected === station.id && (
            <>
              {station.sensors.map(sensor => (
                <div
                  key={sensor.id}
                  className={`sensor ${selection === `sensor-${sensor.id}` ? 'selected' : ''}`}
                  onClick={() => handleSelection('sensor', sensor.id)}
                  onKeyDown={() => handleSelection('sensor', sensor.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={`status ${sensor.health}`} />
                  <div className="sensor-title">{sensor.name}</div>
                </div>
              ))}
              <div
                className="sensor"
                onClick={() => handleAdd('AddSensor')}
                onKeyDown={() => handleAdd('AddSensor')}
                role="button"
                tabIndex={0}
              >
                <div className="sensor-title">+ Add Sensor</div>
              </div>
            </>
          )}
        </div>
      ))}
      <div
        className="station"
        onClick={() => handleAdd('AddStation')}
        onKeyDown={() => handleAdd('AddStation')}
        role="button"
        tabIndex={0}
      >
        <div className="station-title">+ Add Station </div>
      </div>
      <div className="section">Dashboards</div>
      {dashboards.map(dashboard => (
        <div>hi</div>
      ))}
      <div onClick={toggleDashboardModal}>+ New dashboard</div>
    </div>
  );
};

TreeView.propTypes = {
  className: PropTypes.string.isRequired,
  stations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      health: PropTypes.oneOf(['healthy', 'unhealthy']),
      address: PropTypes.string.isRequired,
      port: PropTypes.string.isRequired,
      sensors: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          health: PropTypes.oneOf(['healthy', 'unhealthy']),
        }),
      ),
    }),
  ),
  dashboards: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      sensors: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
        }),
      ),
    }),
  ).isRequired,
};

TreeView.defaultProps = {
  stations: [],
};

const styledTreeView = styled(TreeView)`
  width: 400px;
  box-shadow: 14px 0 10px -10px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 100%;
  top: 70px;
  bottom: -10;
  padding-left: 32px;
  padding-top: 32px;
  box-sizing: border-box;
  z-index: 1;

  .section {
    font-weight: 900;
    font-size: 1.7rem;

    &:last-child {
      margin-top: 1rem;
    }
  }

  .station {
    transition: 0.2s;
    margin-right: 32px;

    &.selected {
      background: #dcffd6;
    }

    &:hover {
      background: #d6f4ff;
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
  }

  .sensor {
    margin-left: 32px;
    margin-right: 32px;
    transition: 0.2s;

    &.selected {
      background: #dcffd6;
    }

    &:hover {
      background: #d6f4ff;
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
`;

export default styledTreeView;
