import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { addOrUpdateHash, removeFromHash } from '../../utilities/Window';

const Header = ({ className }) => {
  const goHome = () => {
    removeFromHash('station');
    removeFromHash('sensor');
  };

  return (
    <div className={className}>
      <div className="title" onClick={goHome}>
        Dragonfly
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
};

const styledHeader = styled(Header)`
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  padding: 16px 32px;
  display: flex;
  align-items: center;
  z-index: 1;
  background: white;

  .title {
    font-size: 32px;
  }

  .time-pickers {
    margin-left: auto;
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
