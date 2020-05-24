import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const Header = ({ className }) => (
  <div className={className}>
    <div className="title">Dragonfly</div>
    <div className="time-pickers">
      Start
      <input type="date" />
      Endasdfasdf
      <input type="data" />
    </div>
  </div>
);
Header.propTypes = {
  className: PropTypes.string.isRequired,
};

const styledHeader = styled(Header)`
  .title {
  }

  .time-pickers {
  }
`;

export default styledHeader;
