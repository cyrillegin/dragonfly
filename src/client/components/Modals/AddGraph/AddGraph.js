import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
// import { windowEmitter, searchToObject } from '../../../utilities/Window';

const AddGraph = ({ className, close }) => {
  // const dashboardId = parseInt(searchToObject().dashboard, 10);
  // console.log(dashboardId);
  const preventClose = event => {
    event.stopPropagation();
  };

  const handleSave = () => {
    //   return; // nope
    //   fetch('/api/dashboard', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(payload),
    //   })
    //     .then(res => res.json())
    //     .then(res => {
    //       if (res.error) {
    //         // setMessage
    //         return;
    //       }
    //       windowEmitter.emit('station-refresh');
    //       close();
    //     });
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
        <div className="title">Add Graph</div>
        <div className="body" />
        <div className="footer">
          <button type="button" onClick={handleSave}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

AddGraph.propTypes = {
  className: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
};

const styledAddGraph = styled(AddGraph)`
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

export default styledAddGraph;
