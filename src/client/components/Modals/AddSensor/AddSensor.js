import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { searchToObject } from '../../../utilities/Window';

/* eslint-disable prefer-destructuring */
const AddSensor = ({ className, close, address, port }) => {
  const [input, setInput] = useState({});
  const [testSuccessfull, setSuccess] = useState(false);
  const [availableSensors, setSensors] = useState([]);

  useEffect(() => {
    fetch(`/list?ip=${address}:${port}`)
      .then(res => res.json())
      .then(res => {
        setSensors([...res, 'self-entry']);
        setInput({ hardwareName: res[0] });
      });
  }, [address, port]);

  const handleInputChange = event => {
    setInput({
      ...input,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSelectChange = event => {
    if (event.target.value === 'self-entry') {
      setSuccess(true);
    } else {
      setSuccess(false);
    }
    setInput({
      ...input,
      hardwareName: event.target.value,
    });
  };

  const handleTest = () => {
    if (input.hardwareName === 'self-entry') {
      return;
    }
    const params = {
      ...input,
    };

    params.stationId = parseInt(searchToObject().station.split('-')[1], 10);

    fetch('/api/sensor/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          setSuccess(false);
        } else {
          setSuccess(true);
        }
      });
  };

  const handleAdd = () => {
    const params = {
      ...input,
    };

    params.stationId = parseInt(searchToObject().station.split('-')[1], 10);

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
          </div>
          <div className="column">
            <div className="group">
              Hardware sensor:
              <select value={input.hardwareSensor} onChange={handleSelectChange}>
                {availableSensors.map(sensor => (
                  <option value={sensor} key={sensor}>
                    {sensor}
                  </option>
                ))}
              </select>
            </div>
            <div className="group">
              Description:
              <input type="text" name="description" />
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
  address: PropTypes.string.isRequired,
  port: PropTypes.string.isRequired,
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
