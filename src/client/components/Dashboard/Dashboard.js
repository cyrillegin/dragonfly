import React, { useEffect, useState, useCallback, Fragment } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Graph from '../../charts/Graph';
import { windowEmitter, searchToObject } from '../../utilities/Window';
import SensorDetails from '../SensorDetails';
import Store from '../../utilities/Store';
import { AddGraph } from '../Modals';

const Dashboard = ({ className, stations, dashboards }) => {
  const [currentStations, changeStations] = useState([]);
  const [currentSensor, changeSensor] = useState({});
  const [currentDashboard, changeDashboard] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const [addGraphModal, setAddGraphModal] = useState(false);

  const setStations = useCallback(() => {
    const { station, sensor, dashboard } = searchToObject();
    if (station) {
      const stationId = parseInt(station, 10);
      const currentStation = stations.filter(sta => sta.id === stationId)[0];
      changeStations([currentStation]);
      changeSensor({});
      changeDashboard({});
    } else if (sensor) {
      const sensorId = parseInt(sensor, 10);
      const currentStation = stations.find(sta => sta.sensors.find(sen => sen.id === sensorId));
      changeStations([currentStation]);
      const curSensor = currentStation.sensors.find(sen => sen.id === sensorId);
      changeSensor(curSensor);
      changeDashboard({});
    } else if (dashboard) {
      changeDashboard(dashboards.find(dash => dash.id === parseInt(dashboard, 10)));
      changeSensor({});
      changeStations([]);
    } else {
      changeStations(stations);
    }
  }, [dashboards, stations]);

  useEffect(() => {
    setStations();
    windowEmitter.listen('change', () => {
      setStations();
    });
  }, [setStations]);

  useEffect(() => {
    Store.listen('collapse', () => {
      setCollapsed(!collapsed);
    });
  }, [collapsed]);

  const handleAddGraph = () => {
    setAddGraphModal(true);
  };

  const closeModal = () => {
    setAddGraphModal(false);
  };

  return (
    <div className={`${className} ${collapsed ? 'collapse' : ''}`}>
      {addGraphModal && <AddGraph close={closeModal} />}
      {currentSensor.id && (
        <div className="sensor tall">
          <Graph name={currentStations[0].name} sensor={currentSensor} renderTrigger={new Date()} />
          <SensorDetails sensor={currentSensor} />
        </div>
      )}

      {!currentSensor.id && currentStations.length && (
        <>
          {currentStations.map(station => (
            <div key={station.id} className="station-section">
              <div className="station-header">{`${station.name} - ${station.address}`}</div>
              {station.sensors.map(sensor => (
                <div className="sensor" key={sensor.id}>
                  <Graph name={station.name} sensor={sensor} renderTrigger={new Date()} />
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {currentDashboard.id && (
        <div className="station">
          <div className="add-graph" onClick={handleAddGraph}>
            <div>+</div>
            <div>Add</div>
          </div>
        </div>
      )}

      {!currentDashboard.id && !currentSensor.id && !currentStations.length && <>Loading...</>}
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
  dashboards: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
};

Dashboard.defaultProps = {
  dashboards: [],
};
const styledDashboard = styled(Dashboard)`
  position: absolute;
  left: 400px;
  background: white;
  width: calc(100% - 408px);
  margin-top: 5rem;
  margin-left: 8px;
  transition: 0.6s;

  &.collapse {
    transform: translateX(-380px);
    width: calc(100% - 28px);
  }

  .station-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
    grid-gap: 1rem;

    .station-header {
      grid-column-start: 1;
      grid-column-end: 4;
      width: 100%;
      border-top: 1px solid #d2d2d2;
      padding-top: 12px;
      font-size: 22px;
    }
  }

  .station {
    .add-graph {
      width: 100%;
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #989898;
      transition: 0.3s;

      div {
        font-size: 2rem;
      }

      &:hover {
        background: #daeeff;
      }
    }
  }

  .sensor {
    width: 100%;
    height: 300px;

    &.tall {
      height: 600px;
    }
  }
`;

export default styledDashboard;
