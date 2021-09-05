import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { addOrUpdateHash, removeFromHash, searchToObject } from '../../utilities/Window';
import { AddStation, AddSensor, AddDashboard } from '../Modals';
import Store from '../../utilities/Store';

const TreeView = ({ className, stations, dashboards }) => {
  const [stationSelected, setStation] = useState('');
  const [selection, setSelection] = useState('');
  const [modal, toggleModal] = useState('');
  const [dashboardSelected, setDashboard] = useState('');
  const [dashboardModal, toggleDashboardModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const { station, sensor, dashboard } = searchToObject();
    if (station) {
      const select = parseInt(station, 10);
      setStation(select);
      setSelection(select);
      setDashboard('');
    }
    if (sensor) {
      setDashboard('');
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
    removeFromHash('actions');

    if (type === 'station') {
      setStation(id);
      setSelection(id);
      setDashboard('');
      addOrUpdateHash('station', id);
    } else if (type === 'sensor') {
      setSelection(id);
      addOrUpdateHash('sensor', id);
      setDashboard('');
    } else if (type === 'actions') {
      addOrUpdateHash('actions', 'all');
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

  const handleCollapse = () => {
    setCollapsed(!collapsed);
    Store.emit('collapse');
  };

  const isHealthy = lastHealthTimestamp => {
    const minutesSince = (new Date() - new Date(lastHealthTimestamp)) / 1000 / 60;
    if (minutesSince > 60) {
      return false;
    }
    return true;
  };

  return (
    <div className={`${className} ${collapsed ? 'collapse' : ''}`}>
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
            className={`station ${selection === station.id ? 'selected' : ''} ${
              isHealthy(station.lastHealthTimestamp) ? '' : 'offline'
            }`}
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
                  } ${isHealthy(sensor.lastHealthTimestamp) ? '' : 'offline'}`}
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
          key={dashboard.id}
          className={`station${dashboard.id === dashboardSelected ? ' selected' : ''}`}
          onClick={() => handleSelection('dashboard', dashboard.id)}
          onKeyDown={() => handleSelection('dashbaord', dashboard.id)}
          role="button"
          tabIndex={0}
        >
          {dashboard.name}
        </div>
      ))}
      <div onClick={toggleDashboardModal}>+ New dashboard</div>

      <div className="section" onClick={() => handleSelection('actions')}>
        Actions
      </div>

      <div className="collapse-button" onClick={handleCollapse}>
        {collapsed ? '>' : '<'}
      </div>
    </div>
  );
};

TreeView.propTypes = {
  className: PropTypes.string.isRequired,
  stations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      port: PropTypes.string.isRequired,
      lastHealthTimestamp: PropTypes.string.isRequired,
      sensors: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          lastHealthTimestamp: PropTypes.string.isRequired,
        }),
      ),
    }),
  ).isRequired,
  dashboards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
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
  transition: 0.6s;
  z-index: 1;

  &.collapse {
    transform: translateX(-377px);
  }

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

    &.offline {
      background: #ffd6d6;
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

    &.offline {
      background: #ffd6d6;
    }

    .sensor-title {
      font-size: 16px;
      margin-left: 16px;
      display: inline-block;
    }
  }

  .collapse-button {
    position: absolute;
    left: 377px;
    background: #bee1ff;
    width: 3rem;
    height: 3rem;
    border-radius: 3rem;
    cursor: pointer;
    padding-top: 2px;
    padding-left: 12px;
    font-size: 2rem;
  }
`;

export default styledTreeView;
