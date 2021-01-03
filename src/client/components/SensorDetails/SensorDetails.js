import React, { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { AddAction } from '../Modals';
import { actionConditions, actionProperties } from '../../utilities/constants';
import { windowEmitter } from '../../utilities/Window';

const SensorDetails = ({ className, sensor }) => {
  const [sensorDetails, setSensorDetails] = useState({
    name: sensor.name || '',
    description: sensor.description || '',
    coefficients: sensor.coefficients || '',
    pollRate: sensor.pollRate || '',
    unit: sensor.unit || '',
  });

  const [successMessage, updateSuccessMessage] = useState('');
  const [actionModal, updateActionModal] = useState({});
  const [actionMessage, setActionMessage] = useState('');

  const addAction = action => {
    updateActionModal({ id: -1 });
  };

  const editAction = action => {
    updateActionModal(action);
  };

  const deleteAction = action => {
    fetch(`/api/action/${action.id}`, {
      method: 'DELETE',
    }).then(() => {
      windowEmitter.emit('station-refresh');
    });
  };

  const saveAction = action => {
    const body = {
      stationId: sensor.stationId,
      sensorId: sensor.id,
      ...action,
    };
    let method = '';
    if (action.id === -1) {
      method = 'POST';
      delete body.id;
    } else {
      method = 'PUT';
    }

    fetch('/api/action', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          setActionMessage(res.error);
        } else {
          updateActionModal({});
          windowEmitter.emit('station-refresh');
        }
      });
  };

  const cancelAction = () => {
    updateActionModal({});
  };

  const handleSaveInput = () => {
    if (sensorDetails.name === '') {
      updateSuccessMessage('Name must be something');
      return;
    }
    fetch('/api/sensor', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: sensor.id,
        name: sensorDetails.name,
        description: sensorDetails.description === '' ? null : sensorDetails.description,
        coefficients: sensorDetails.Coefs === '' ? null : sensorDetails.coefficients,
        pollRate: sensorDetails.pollRate === '' ? null : sensorDetails.pollRate,
        unit: sensorDetails.unit === '' ? null : sensorDetails.unit,
      }),
    })
      .then(res => res.json())
      .then(res => {
        updateSuccessMessage(res.message || res.error);
        setTimeout(() => {
          updateSuccessMessage('');
        }, 15000);
      });
  };

  const handleInputChange = event => {
    setSensorDetails({ ...sensorDetails, [event.target.name]: event.target.value });
  };
  let datestring = 'No readings';
  if (sensor.lastReading) {
    const date = new Date(sensor.lastReading.timestamp);

    datestring = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  }

  return (
    <div className={className}>
      {actionModal.id && (
        <AddAction
          action={actionModal}
          actionConditions={actionConditions}
          message={actionMessage}
          save={saveAction}
          cancel={cancelAction}
        />
      )}
      <div className="title">Sensor Details</div>
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
          <span>{sensor.lastReading ? sensor.lastReading.value : 'null'}</span>
        </div>

        <div className="item">
          Name:
          <input value={sensorDetails.name} name="name" onChange={handleInputChange} />
        </div>
        <div className="item">
          Description
          <input
            value={sensorDetails.description}
            name="description"
            onChange={handleInputChange}
          />
        </div>
        <div className="item">
          Coefficients:
          <input
            value={sensorDetails.coefficients}
            name="coefficients"
            onChange={handleInputChange}
          />
        </div>
        <div className="item">
          Unit:
          <input value={sensorDetails.unit} name="unit" onChange={handleInputChange} />
        </div>
        <div className="item">
          Poll rate:
          <input value={sensorDetails.pollRate} name="pollRate" onChange={handleInputChange} />
        </div>

        <div className="item">
          <button type="button" onClick={handleSaveInput}>
            save
          </button>
          {successMessage !== '' && <span>{successMessage}</span>}
        </div>
      </div>

      <div className="title">Actions</div>

      <div className="actions-grid">
        <div className="action-row">
          {actionProperties.map(prop => (
            <div className="actions-item" key={prop}>
              {prop}
            </div>
          ))}
          <div />
          <div />
        </div>

        {sensor.actions.map(action => (
          <div className="action-row" key={action.id}>
            <div className="actions-item">{action.value}</div>
            <div className="actions-item">{action.valueType}</div>
            <div className="actions-item">{action.condition}</div>
            <div className="actions-item">{action.action}</div>
            <div className="actions-item">{action.interval}</div>
            <div className="actions-item">{action.metaData}</div>
            <button type="button" onClick={() => editAction(action)}>
              Edit
            </button>
            <button type="button" onClick={() => deleteAction(action)}>
              Delete
            </button>
          </div>
        ))}
        <button className="add-button" type="button" onClick={addAction}>
          +
        </button>
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
    pollRate: PropTypes.number,
    unit: PropTypes.string,
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

  .title {
    font-size: 24px;
  }

  .actions-grid {
    display: grid;
    margin-bottom: 36px;

    .action-row {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      height: 40px;

      &:first-of-type {
        background: #c8ffc8;
      }
    }

    .add-button {
      width: 24px;
      margin-bottom: 10rem;
    }
  }
`;

export default styledSensorDetails;
