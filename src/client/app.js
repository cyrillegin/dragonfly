import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Header from './components/Header';
import TreeView from './components/TreeView';
import Dashboard from './components/Dashboard';

const App = ({ className }) => {
  const [stations, setStations] = useState([]);
  useEffect(() => {
    fetch('/api/stations')
      .then(res => res.json())
      .then(res => {
        console.log(res[0]);
        setStations(res);
      });
  }, []);

  return (
    <div className={className}>
      <Header />
      {stations.length && (
        <div className="main-container">
          <TreeView stations={stations} />
          <Dashboard stations={stations} />
        </div>
      )}
    </div>
  );
};
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
