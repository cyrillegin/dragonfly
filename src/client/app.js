import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Header from './components/Header';
import TreeView from './components/TreeView';
import Dashboard from './components/Dashboard';

const App = ({ className }) => (
  <div className={className}>
    <Header />
    <div className="main-container">
      <TreeView />
      <Dashboard />
    </div>
  </div>
);

App.propTypes = {
  className: PropTypes.string.isRequired,
};

const styledApp = styled(App)`
  box-sizing: border-box;
  margin: -8px;
  font-family: 'Muli', sans-serif;

  .main-container {
    display: flex;
  }
`;

export default styledApp;
