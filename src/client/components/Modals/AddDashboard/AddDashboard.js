import React, { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { windowEmitter } from '../../../utilities/Window';

const AddDashboard = ({ className, close, stations }) => {
  const [dashboardName, updateDashBoardName] = useState('');

  const preventClose = event => {
    event.stopPropagation();
  };

  const handleSave = () => {
    const payload = {
      name: dashboardName,
    };

    fetch('/api/dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          // setMessage
          return;
        }
        windowEmitter.emit('station-refresh');
        close();
      });
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
          Dashboard Name:
          <input
            value={dashboardName}
            onChange={event => updateDashBoardName(event.target.value)}
          />
        </div>
        <div className="footer">
          <button type="button" onClick={handleSave}>
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
