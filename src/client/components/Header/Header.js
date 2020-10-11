import React, { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { addOrUpdateHash, removeFromHash } from '../../utilities/Window';
import BulkAdd from '../Modals/BulkAdd';
import Store from '../../utilities/Store';

const Header = ({ className, stations }) => {
  const [addModalIsOpen, toggleAddModalIsOpen] = useState(false);
  const [refreshRate, setRefreshRate] = useState(60);

  const handleRefreshUpdate = event => {
    setRefreshRate(event.target.value);
    Store.updateRefreshInterval(event.target.value);
  };
  const goHome = () => {
    removeFromHash('station');
    removeFromHash('sensor');
  };

  const toggleModal = (open = !addModalIsOpen) => {
    toggleAddModalIsOpen(open);
  };

  return (
    <div className={className}>
      {addModalIsOpen && <BulkAdd close={() => toggleModal(false)} stations={stations} />}
      <div role="button" tabIndex={0} className="title" onClick={goHome} onKeyDown={goHome}>
        Dragonfly
      </div>
      <div className="bulk-add">
        <button onClick={() => toggleModal(true)} type="button">
          Bulk Add
        </button>
      </div>
      <div className="time-pickers">
        <label htmlFor="start-time">Start Date</label>
        <input
          id="start-time"
          type="date"
          onChange={event => addOrUpdateHash('start', event.target.value)}
        />
        <label htmlFor="end-time">End Date</label>
        <input
          id="end-time"
          type="date"
          onChange={event => addOrUpdateHash('end', event.target.value)}
        />
        <label htmlFor="auto-refresh"> Auto Refresh</label>
        <select id="auto-refresh" value={refreshRate} onChange={handleRefreshUpdate}>
          <option value={5}>5s</option>
          <option value={30}>30s</option>
          <option value={60}>1m</option>
          <option value={60 * 5}>5m</option>
          <option value={60 * 20}>20m</option>
        </select>
      </div>
    </div>
  );
};

Header.propTypes = {
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
  ),
};

Header.defaultProps = {
  stations: [],
};

const styledHeader = styled(Header)`
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  padding: 16px 32px;
  display: flex;
  align-items: center;
  z-index: 2;
  background: white;
  position: fixed;
  width: 100%;

  .title {
    font-size: 32px;
  }

  .bulk-add {
    margin-left: auto;

    button {
      background: none;
      border: 1px solid #a2a2a2;
      padding: 8px;
    }
  }

  .time-pickers {
    font-size: 16px;

    label {
      margin-left: 24px;
    }

    input {
      margin-left: 8px;
    }

    select {
      margin-left: 8px;
    }
  }
`;

export default styledHeader;
