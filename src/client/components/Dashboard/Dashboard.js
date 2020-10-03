import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Graph from '../../charts/Graph';
import { windowEmitter, searchToObject } from '../../utilities/Window';
import SensorDetails from '../SensorDetails';

const Dashboard = ({ className, stations }) => {
  const [currentStations, changeStations] = useState([]);
  const [currentSensor, changeSensor] = useState({});

  useEffect(() => {
    const setStations = () => {
      const current = searchToObject();
      if (current.station) {
        const stationId = parseInt(current.station.replace('station-', ''), 10);
        const currentStation = stations.filter(station => station.id === stationId)[0];
        changeStations([currentStation]);
        if (current.sensor) {
          const sensorId = parseInt(current.sensor.replace('sensor-', ''), 10);
          changeSensor(currentStation.sensors.filter(sensor => sensor.id === sensorId)[0]);
        } else {
          changeSensor({});
        }
      } else {
        changeSensor({});
        changeStations(stations);
      }
    };

    setStations();
    windowEmitter.listen('change', () => {
      setStations();
    });
  }, []);

  return (
    <div className={className}>
      {currentSensor.id && (
        <div className="station">
          <div className="sensor">
            <Graph station={currentStations[0]} sensor={currentSensor} />
            <SensorDetails sensor={currentSensor} />
          </div>
        </div>
      )}

      {!currentSensor.id && currentStations.length && (
        <>
          {currentStations.map(station => (
            <div className="station" key={station.id}>
              {station.sensors.map(sensor => (
                <div className="sensor" key={sensor.id}>
                  <Graph station={station} sensor={sensor} />
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {!currentSensor && !currentStations.length && <>Loading...</>}
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
  background: white;
  width: calc(100% - 400px);
  margin-top: 5rem;
  margin-left: 8px;

  .station {
    width: 100%;
    background: white;
    display: flex;
    margin: 2rem 0;

    .sensor {
      margin: 0 2rem;
      flex: 1;
    }
  }
`;

export default styledDashboard;
