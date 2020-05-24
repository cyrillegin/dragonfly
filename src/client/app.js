import React from 'react';
import styled from '@emotion/styled';
import Header from './components/Header';
import TreeView from './components/TreeView';
import Dashboard from './components/Dashboard';

const App = () => (
  <div className="page">
    <Header />
    <div className="main-container">
      <TreeView />
      <Dashboard />
    </div>
  </div>
);

const styledApp = styled(App)``;

export default styledApp;
