import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const AddDashboard = ({ className, close, stations }) => {
  const [sensors, setSensors] = useState([]);
  const [selection, setSelection] = useState('');
  const [availableSensors, setAvailableSensors] = useState([]);
  const [dashboardName, updateDashBoardName] = useState('');

  useEffect(() => {
    setAvailableSensors(stations);
  }, [stations]);

  const preventClose = event => {
    event.stopPropagation();
  };

  const handleChange = event => {
    setSelection(parseInt(event.target.value, 10));
  };

  const handleAdd = () => {
    let sensorToAdd;
    stations.forEach(station => {
      station.sensors.forEach(sensor => {
        if (sensor.id === selection) {
          sensorToAdd = sensor;
        }
      });
    });

    setSensors([...sensors, sensorToAdd]);
    setAvailableSensors(
      availableSensors.map(station => ({
        ...station,
        sensors: station.sensors.reduce((acc, cur) => {
          if (cur.id === sensorToAdd.id) {
            return acc;
          }
          return [...acc, cur];
        }, []),
      })),
    );
  };

  const handleRemove = sensorToRemove => {
    sensors.splice(
      sensors.findIndex(sensor => sensor.id === sensorToRemove.id),
      1,
    );
    setSensors([...sensors]);

    availableSensors
      .find(station => station.id === sensorToRemove.stationId)
      .sensors.push(sensorToRemove);
    setAvailableSensors([...availableSensors]);
  };

  const handleAddDashboard = () => {
    console.log('add');
  };

  return (
    <div className={className} onClick={close} role="button" onKeyDown={close} tabIndex={0}>
      <div
        className="modal"
        role="button"
        tabIndex={0}
        onClick={preventClose}
        onKeyDown={preventClose}
      >
        <div className="title">Dashboard creator</div>
        <div className="body">
          {sensors.map(sensor => (
            <div key={sensor.id}>
              {sensor.name}
              <button type="button" onClick={() => handleRemove(sensor)}>
                -
              </button>
            </div>
          ))}

          <select onChange={handleChange} value={selection}>
            {availableSensors.map(station => (
              <optgroup label={station.name} key={station.id}>
                {station.sensors.map(sensor => (
                  <option value={sensor.id} key={sensor.id}>
                    {sensor.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button type="button" onClick={handleAdd}>
            Add
          </button>
        </div>
        <div className="footer">
          Dashboard Name:
          <input
            value={dashboardName}
            onChange={event => updateDashBoardName(event.target.value)}
          />
          <button type="button" onClick={handleAddDashboard}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

AddDashboard.propTypes = {
  className: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  stations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      sensors: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          id: PropTypes.number.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
};

const styledAddDashboard = styled(AddDashboard)`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.75);

  .modal {
    width: 600px;
    height: 601px;
    background: white;
    margin: 5rem auto;
    border-radius: 0.5rem;
    padding: 1rem;
    box-sizing: border-box;
  }
`;

export default styledAddDashboard;
