import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { addOrUpdateHash, removeFromHash, searchToObject } from '../../utilities/Window';
import { AddStation, AddSensor, AddDashboard } from '../Modals';

const TreeView = ({ className, stations, dashboards }) => {
  const [stationSelected, setStation] = useState('');
  const [selection, setSelection] = useState('');
  const [modal, toggleModal] = useState('');
  const [dashboardSelected, setDashboard] = useState('');

  const [dashboardModal, toggleDashboardModal] = useState(false);

  useEffect(() => {
    const { station, sensor, dashboard } = searchToObject();
    if (station) {
      const select = parseInt(station, 10);
      setStation(select);
      setSelection(select);
    }
    if (sensor) {
      const select = parseInt(sensor, 10);
      setSelection(select);
      stations.forEach(sta => {
        if (sta.sensors.find(sen => sen.id === select)) {
          setStation(sta.id);
        }
      });
    }
    if (dashboard) {
      setDashboard(dashboard);
    }
  }, [setStation, setSelection, stations]);

  const handleSelection = (type, id) => {
    const select = `${type}-${id}`;
    setSelection(select);

    removeFromHash('station');
    removeFromHash('sensor');
    removeFromHash('dashboard');

    if (type === 'station') {
      setStation(id);
      setSelection(id);
      addOrUpdateHash('station', id);
    } else if (type === 'sensor') {
      setSelection(id);
      addOrUpdateHash('sensor', id);
    } else {
      addOrUpdateHash('dashboard', id);
      setStation('');
      setSelection('');
      setDashboard(id);
    }
  };

  const handleAdd = type => {
    toggleModal(type);
  };

  return (
    <div className={className}>
      {modal === 'AddStation' && <AddStation close={() => toggleModal('')} />}
      {modal === 'AddSensor' && (
        <AddSensor
          close={() => toggleModal('')}
          address={stations.filter(station => station.id === stationSelected)[0].address}
          port={stations.filter(station => station.id === stationSelected)[0].port}
        />
      )}
      {dashboardModal && (
        <AddDashboard stations={stations} close={() => toggleDashboardModal(false)} />
      )}
      <div className="section">Stations</div>
      {stations.map(station => (
        <div key={station.id}>
          <div
            className={`station ${selection === station.id ? 'selected' : ''}`}
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
                  className={`sensor ${
                    window.location.search.includes('sensor') && selection === sensor.id
                      ? 'selected'
                      : ''
                  }`}
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
        <div
          key={dashboard.dashboardId}
          className={`station${dashboard.dashboardId === dashboardSelected ? ' selected' : ''}`}
          onClick={() => handleSelection('dashboard', dashboard.dashboardId)}
          onKeyDown={() => handleSelection('dashbaord', dashboard.dashboardId)}
          role="button"
          tabIndex={0}
        >
          {dashboard.name}
        </div>
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
  ).isRequired,
  dashboards: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      sensors: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          stationId: PropTypes.number.isRequired,
          position: PropTypes.number.isRequired,
        }),
      ),
    }),
  ).isRequired,
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
