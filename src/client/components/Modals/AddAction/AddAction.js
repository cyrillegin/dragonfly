import React, { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const AddAction = ({ className, action, actionConditions, message, save, cancel }) => {
  const [details, setDetails] = useState({
    value: 0,
    condition: actionConditions[0],
    interval: 0,
    metadata: '',
    action: 'slack',
    ...action,
  });

  const preventClose = event => {
    event.stopPropagation();
  };

  const updateDetails = event => {
    setDetails({
      ...details,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className={className} onClick={cancel} role="button" onKeyDown={cancel} tabIndex={0}>
      <div
        className="modal"
        role="button"
        tabIndex={0}
        onClick={preventClose}
        onKeyDown={preventClose}
      >
        <div className="title">Add Action</div>
        <div className="body">
          <div>
            <span>Value:</span>
            <input value={details.value} onChange={updateDetails} name="value" />
          </div>
          <div>
            <span>Value Type:</span>
            <select value={details.valueType} onChange={updateDetails} name="valueType">
              <option value="value">value</option>
              <option value="timestamp">timestamp</option>
              <option value="time">time</option>
            </select>
          </div>
          <div>
            <span> Condition:</span>
            <select value={details.condition} onChange={updateDetails} name="condition">
              {actionConditions.map(condition => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span> Action:</span>
            <select value={details.action} onChange={updateDetails} name="action">
              <option value="slack">slack</option>
            </select>
          </div>
          <div>
            <span> Interval:</span>
            <input value={details.interval} onChange={updateDetails} name="interval" type="text" />
          </div>
          <div>
            <span>Metadata:</span>
            <input value={details.metadata} onChange={updateDetails} name="metadata" type="text" />
          </div>
        </div>
        <div className="error-message">{message}</div>
        <div className="footer">
          <button type="button" onClick={() => save(details)}>
            Save
          </button>
          <button type="button" onClick={cancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

AddAction.propTypes = {
  className: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  actionConditions: PropTypes.arrayOf(PropTypes.string).isRequired,
  message: PropTypes.string,
  action: PropTypes.shape({
    condition: PropTypes.string,
    interval: PropTypes.string,
    action: PropTypes.string,
    id: PropTypes.number.isRequired,
  }).isRequired,
};

AddAction.defaultProps = {
  message: '',
};

const styledAddAction = styled(AddAction)`
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

    .body {
      div {
        width: 350px;
        display: flex;

        span {
          flex: 1;
        }

        input {
          flex: 1;
        }

        select {
          flex: 1;
        }
      }
    }

    .error-message {
      color: red;
    }

    .footer {
      text-align: right;
      width: 200px;
      float: right;
      display: flex;
      margin-top: 36px;

      button {
        flex: 1;
      }
    }
  }
`;

export default styledAddAction;
