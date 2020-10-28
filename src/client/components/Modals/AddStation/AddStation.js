import React, { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const AddStation = ({ className, close }) => {
  const [input, setInput] = useState({});
  const [testSuccessfull, setSuccess] = useState(false);
  const [errorMessage, setError] = useState('');

  const handleInputChange = event => {
    setSuccess(false);
    setInput({
      ...input,
      [event.target.name]: event.target.value,
    });
  };

  const handleTest = () => {
    const params = {
      ...input,
    };

    if (!params.name) {
      setError('A station name must be provided.');
      return;
    }

    if (!params.address) {
      setError('A station address must be provided.');
      return;
    }
    setError('Testing...');

    fetch('/api/station/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          setSuccess(false);
          setError(res.error);
          return;
        }
        if (res.message === 'success') {
          setSuccess(true);
          setError('');
        } else {
          setError('An unknown error occured.');
          setSuccess(false);
        }
      });
  };

  const handleAdd = () => {
    const params = {
      ...input,
    };
    setError('Adding...');
    fetch('/api/station/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then(res => res.json())
      .then(res => {
        if (res.message === 'success') {
          setError('Station Added!');
        } else if (res.error) {
          setError(res.error);
        } else {
          setError('An unknow error occured.');
        }
      });
  };

  const preventClose = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className={className} onClick={close}>
      <div className="modal" onClick={preventClose}>
        <div className="title">Add Station</div>
        <div className="body">
          <div className="column">
            <div className="group">
              Name:
              <input type="text" name="name" onChange={handleInputChange} />
            </div>

            <div className="group">
              Adress:
              <input type="text" name="address" onChange={handleInputChange} />
            </div>
          </div>
          <div className="column">
            <div className="group">
              Description:
              <input type="text" ame="description" />
            </div>
            <div className="group">
              Port:
              <input type="text" name="port" onChange={handleInputChange} />
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
        {errorMessage !== '' && <div className="error">{errorMessage}</div>}
      </div>
    </div>
  );
};

AddStation.propTypes = {
  className: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
};

const styledAddStation = styled(AddStation)`
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

    .error {
      color: red;
      margin-top: 8px;
    }
  }
`;

export default styledAddStation;
