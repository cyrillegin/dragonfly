import React, { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const modalDetails = {
  station: {
    title: 'Add Station',
  },
  sensor: {
    title: 'Add Sensor',
  },
};
const Modal = ({ className, type, close }) => {
  const [input, setInput] = useState({});

  const handleInputChange = event =>
    setInput({
      ...input,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  const handleTest = () => {
    const params = {
      ...input,
    };

    fetch(`/api/${type}s/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then(res => res.json())
      .then(res => {
        console.log('got res');
        console.log(res);
      });
  };

  const preventClose = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={className} onClick={close}>
      <div className="modal" onClick={preventClose}>
        <div className="title">{modalDetails[type].title}</div>
        <div className="body">
          <div className="column">
            <div className="group">
              Name:
              <input type="text" ame="name" />
            </div>
            {type === 'station' && (
              <div className="group">
                IP Adress:
                <input type="text" name="ipaddress" onChange={handleInputChange} />
              </div>
            )}
            {type === 'sensor' && (
              <>
                <div className="group">
                  Coeffecients:
                  <input type="text" name="coeffecients" />
                </div>

                <div className="group">
                  Sensor Type:
                  <input type="text" name="sensorType" />
                </div>
              </>
            )}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
Modal.propTypes = {
  className: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['station', 'sensor']).isRequired,
  close: PropTypes.func.isRequired,
};

Modal.defaultProps = {};

const styledModal = styled(Modal)`
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
        }
      }
    }
  }
`;

export default styledModal;