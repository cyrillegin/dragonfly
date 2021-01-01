import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { AddAction } from '../Modals';
import { actionConditions } from '../../utilities/constants';
import { windowEmitter } from '../../utilities/Window';
import Store from '../../utilities/Store';

const Actions = ({ className, stations }) => {
  const [actions, setActions] = useState([]);
  const [actionModal, updateActionModal] = useState({});
  const [actionMessage, setActionMessage] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const acts = [];
    stations.forEach(station => {
      station.sensors.forEach(sensor => {
        sensor.actions.forEach(action => {
          acts.push({
            ...action,
            stationName: station.name,
            stationId: station.id,
            sensorName: sensor.name,
            sensorId: sensor.id,
          });
        });
      });
    });
    setActions(acts);
  }, [stations]);

  useEffect(() => {
    Store.listen('collapse', () => {
      setCollapsed(!collapsed);
    });
  }, [collapsed]);

  const handleEdit = action => {
    updateActionModal(action);
  };

  const handleDelete = action => {
    fetch(`/api/action/${action.id}`, {
      method: 'DELETE',
    }).then(() => {
      windowEmitter.emit('station-refresh');
    });
  };

  const saveAction = action => {
    const body = {
      stationId: action.stationId,
      sensorId: action.sensorId,
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
  return (
    <div className={`${className} ${collapsed ? 'collapse' : ''}`}>
      {actionModal.id && (
        <AddAction
          action={actionModal}
          actionConditions={actionConditions}
          message={actionMessage}
          save={saveAction}
          cancel={cancelAction}
        />
      )}
      <div className="table">
        <div className="row">
          <div className="col">Station</div>
          <div className="col">Sensor</div>
          <div className="col">Value</div>
          <div className="col">Condition</div>
          <div className="col">Action</div>
          <div className="col">Interval</div>
          <div className="col">Meta data</div>
          <div className="col" />
          <div className="col" />
        </div>
        {actions.map(action => (
          <div className="row" key={action.id}>
            <div className="col">{action.stationName}</div>
            <div className="col">{action.sensorName}</div>
            <div className="col">{action.value}</div>
            <div className="col">{action.condition}</div>
            <div className="col">{action.action}</div>
            <div className="col">{action.interval}</div>
            <div className="col">{action.metadata}</div>
            <div className="col">
              <button className="col" type="button" onClick={() => handleEdit(action)}>
                Edit
              </button>
            </div>
            <div className="col">
              <button className="col" type="button" onClick={() => handleDelete(action)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Actions.propTypes = {
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
};

const styledActions = styled(Actions)`
  position: absolute;
  left: 400px;
  background: white;
  width: calc(100% - 458px);
  margin-top: 7rem;
  margin-left: 2rem;
  transition: 0.6s;

  &.collapse {
    transform: translateX(-400px);
    width: calc(100% - 58px);
  }

  .table {
    .row {
      display: flex;
      padding: 1rem;

      &:nth-child(even) {
        background: #f8f6ff;
      }

      &:first-child {
        background: #bee1ff;
        font-weight: bold;
      }

      .col {
        flex: 1;
        padding: 0 2rem;
      }
    }
  }
`;

export default styledActions;
