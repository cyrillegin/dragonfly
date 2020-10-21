import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const Loader = ({ className }) => (
  <div className={className}>
    <div className="loader-outter" />
    <div className="loader-inner" />
  </div>
);

Loader.propTypes = {
  className: PropTypes.string.isRequired,
};

const styledLoader = styled(Loader)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: block;
  vertical-align: middle;
  left: calc(50% - 60px / 2);
  top: calc(50% - 60px / 2);
  position: absolute;

  .loader-outter {
    position: absolute;
    border: 4px solid #f50057;
    border-left-color: transparent;
    border-bottom: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    -webkit-animation: loader-outter 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
    animation: loader-outter 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
  }

  .loader-inner {
    position: absolute;
    border: 4px solid #f50057;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    left: calc(50% - 20px);
    top: calc(50% - 20px);
    border-right: 0;
    border-top-color: transparent;
    -webkit-animation: loader-inner 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
    animation: loader-inner 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
  }

  /* ----------------     KEYFRAMES    ----------------- */

  @-webkit-keyframes loader-outter {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes loader-outter {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @-webkit-keyframes loader-inner {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(-360deg);
      transform: rotate(-360deg);
    }
  }

  @keyframes loader-inner {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(-360deg);
      transform: rotate(-360deg);
    }
  }
`;

export default styledLoader;
