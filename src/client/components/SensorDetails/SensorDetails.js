/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const SensorDetails = ({ className, sensor }) => {
  const [sensorName, updateSensorName] = useState('');
  const [sensorDescription, updateSensorDescription] = useState('');
  const [sensorCoefs, updateSensorCoefs] = useState('');

  const [successMessage, updateSuccessMessage] = useState('');

  useEffect(() => {
    updateSensorName(sensor.name);
    if (sensor.description) {
      updateSensorDescription(sensor.description);
    }
    if (sensor.coefficients) {
      updateSensorCoefs(sensor.coefficients);
    }
  }, [sensor]);

  const changeType = type => {
    // console.log('change');
  };

  const editAction = id => {
    // console.log('editing');
  };

  const addAction = () => {
    // console.log('adding actions');
  };

  const handleSaveInput = () => {
    if (sensorName === '') {
      updateSuccessMessage('Name must be something');
      return;
    }
    fetch('/api/sensor', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: sensor.id,
        name: sensorName,
        description: sensorDescription === '' ? null : sensorDescription,
        coefficients: sensorCoefs === '' ? null : sensorCoefs,
      }),
    })
      .then(res => res.json())
      .then(res => {
        updateSuccessMessage(res.message);
        setTimeout(() => {
          updateSuccessMessage('');
        }, 5000);
      });
  };

  const handleInputChange = event => {
    switch (event.target.name) {
      case 'sensorName':
        updateSensorName(event.target.value);
        break;
      case 'sensorDescription':
        updateSensorDescription(event.target.value);
        break;
      case 'sensorCoefs':
        updateSensorCoefs(event.target.value);
        break;
    }
  };

  const date = new Date(sensor.lastReading.timestamp);

  const datestring = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

  return (
    <div className={className}>
      <div className="grid">
        <div className="item">
          Station:
          <span>{sensor.stationName}</span>
        </div>
        <div className="item">
          Sensor:
          <span>{sensor.name}</span>
        </div>
        <div className="item">
          Last Reading Time:
          <span>{datestring}</span>
        </div>
        <div className="item">
          Last Reading Value:
          <span>{sensor.lastReading.value}</span>
        </div>

        <div className="item">
          Update name:
          <input value={sensorName} name="sensorName" onChange={handleInputChange} />
        </div>
        <div className="item">
          Description
          <input value={sensorDescription} name="sensorDescription" onChange={handleInputChange} />
        </div>
        <div className="item">
          Coefs:
          <input value={sensorCoefs} name="sensorCoefs" onChange={handleInputChange} />
        </div>

        <div className="item">
          <button type="button" onClick={handleSaveInput}>
            save
          </button>
          {successMessage !== '' && <span>{successMessage}</span>}
        </div>
      </div>

      <div className="actions-title">Actions</div>
      <div className="actions-grid">
        <div className="actions-item">Value</div>
        <div className="actions-item">Condition</div>
        <div className="actions-item">action</div>
        <div className="actions-item">interval</div>
        <div className="actions-item">meta?</div>
      </div>
    </div>
  );
};

SensorDetails.propTypes = {
  className: PropTypes.string.isRequired,
  sensor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    coefficients: PropTypes.string,
    health: PropTypes.oneOf(['healthy', 'unhealthy']),
    stationId: PropTypes.number.isRequired,
    stationName: PropTypes.string.isRequired,
    lastReading: PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        condition: PropTypes.string.isRequired,
        interval: PropTypes.string.isRequired,
        action: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
      }),
    ),
  }).isRequired,
};

const styledSensorDetails = styled(SensorDetails)`
  width: 100%;
  padding: 0 3rem;

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;

    .item {
      height: 40px;

      span {
        padding-left: 5px;
        font-weight: 900;
      }

      input {
        margin-left: 5px;
      }
    }
  }

  .actions-title {
  }

  .actions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

    .actions-item {
    }
  }
`;

export default styledSensorDetails;
