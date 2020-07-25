import React, { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

/* eslint-disable prefer-destructuring */
const AddSensor = ({ className, close }) => {
  const [input, setInput] = useState({});
  const [testSuccessfull, setSuccess] = useState(false);

  const handleInputChange = event =>
    setInput({
      ...input,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  const handleTest = () => {
    const params = {
      ...input,
    };

    if (!params.name) {
      return;
    }

    params.stationId = window.location.search.split('=')[1].split('-')[1];

    fetch('/api/sensor/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then(res => res.json())
      .then(res => {
        if (res.message === 'success') {
          setSuccess(true);
        } else {
          setSuccess(false);
        }
      });
  };

  const handleAdd = () => {
    const params = {
      ...input,
    };

    params.stationId = window.location.search.split('=')[1].split('-')[1];

    fetch('/api/sensor/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then(res => res.json())
      .then(res => {});
  };

  const preventClose = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className={className} onClick={close}>
      <div className="modal" onClick={preventClose}>
        <div className="title">Add Sensor</div>
        <div className="body">
          <div className="column">
            <div className="group">
              Name:
              <input type="text" name="name" onChange={handleInputChange} />
            </div>

            <div className="group">
              Coeffecients:
              <input type="text" name="coeffecients" />
            </div>

            <div className="group">
              Sensor Type:
              <input type="text" name="sensorType" onChange={handleInputChange} />
            </div>
          </div>
          <div className="column">
            <div className="group">
              Description:
              <input type="text" ame="description" />
            </div>
            <div className="group">
              <button type="button" onClick={handleTest}>
                Test
              </button>
              <span className={`${testSuccessfull ? 'green' : 'red'}`} />
              <br />
              {testSuccessfull && (
                <button type="button" onClick={handleAdd}>
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AddSensor.propTypes = {
  className: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
};

const styledAddSensor = styled(AddSensor)`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 2;

  .modal {
    width: 600px;
    height: 601px;
    background: white;
    margin: 5rem auto;
    border-radius: 0.5rem;
    padding: 1rem;
    box-sizing: border-box;

    .body {
      display: flex;

      .column {
        flex: 1;

        .group {
          span {
            width: 10px;
            height: 10px;
            border-radius: 10px;
            margin: 0 20px;
            display: inline-block;

            &.red {
              background: red;
            }

            &.green {
              background: green;
            }
          }
        }
      }
    }
  }
`;

export default styledAddSensor;
