import React, { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { addOrUpdateHash, removeFromHash } from '../../utilities/Window';
import BulkAdd from '../Modals/BulkAdd';

const Header = ({ className, stations }) => {
  const [addModalIsOpen, toggleAddModalIsOpen] = useState(false);
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
      <div className="title" onClick={goHome}>
        Dragonfly
      </div>
      <div className="bulk-add">
        <button onClick={() => toggleModal(true)} type="button">
          Bulk Add
        </button>
      </div>
      <div className="time-pickers">
        <label>Start Date</label>
        <input type="date" onChange={event => addOrUpdateHash('start', event.target.value)} />
        <label>End Date</label>
        <input type="date" onChange={event => addOrUpdateHash('end', event.target.value)} />
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
  z-index: 1;
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
  }
`;

export default styledHeader;
