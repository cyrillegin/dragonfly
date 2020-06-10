import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const SensorDetails = ({ className, sensor }) => {
  const changeType = e => {
    console.log('change');
  };

  const editAction = id => {
    console.log('editing');
  };

  const handleTest = () => {
    console.log('test');
  };

  const addAction = () => {
    console.log('adding actions');
  };

  return (
    <div className={className}>
      <div className="group">
        <span>Name:</span>
        <input type="text" />
      </div>

      <div className="group">
        <span>IP Adress:</span>
        <input type="text" />
      </div>

      <div className="group">
        <span>Description</span>
        <input type="textarea" />
      </div>

      <div className="group">
        <span>Type</span>
        <select onChange={changeType}>
          <option>Temperature</option>
          <option>Switch</option>
        </select>
      </div>

      <div className="group">
        <span>Coeffecients</span>
        <input type="text" />
      </div>

      <div className="group">
        <button type="button" onClick={handleTest}>
          Test
        </button>
      </div>
      <div className="group">
        <span>Actions</span>
        {sensor.actions &&
          sensor.actions.map(action => (
            <div className="action" key={action.id}>
              <span>{action.condition}</span>
              <span>{action.interval}</span>
              <span>{action.action}</span>
              <button type="button" onClick={() => editAction(action)}>
                Edit
              </button>
            </div>
          ))}
        <button type="button" onClick={addAction}>
          Add
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
    health: PropTypes.oneOf(['healthy', 'unhealthy']),
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
  display: flex;

  .group {
    width: 200px;
  }
`;

export default styledSensorDetails;
