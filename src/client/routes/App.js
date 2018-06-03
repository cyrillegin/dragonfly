import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
// import PropTypes from 'prop-types';
import HomeContainer from './../pages/Home/HomeContainer';
import AddSensorContainer from './../pages/AddSensor/AddSensorContainer';
// Nav
import NavBar from './../components/NavBar/NavBar';

export default class App extends Component {
  static propTypes = {};

  render() {
    return (
      <Router>
        <div>
          <NavBar />

          <Route exact path="/" component={HomeContainer} />

          <Route exact path="/addsensors" component={AddSensorContainer} />

        </div>
      </Router>
    );
  }
}
