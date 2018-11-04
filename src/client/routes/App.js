import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { SharedSnackbarProvider } from '../components/snackbar/snackbar';
import HomeContainer from './../pages/Home/HomeContainer';
import AddSensorContainer from './../pages/AddSensor/AddSensorContainer';
import NavBar from './../components/NavBar/NavBarContainer';

export default class App extends Component {
  static propTypes = {};

  render() {
    return (
      <Router>
        <SharedSnackbarProvider>
          <NavBar />
          <Route exact path="/addsensors" component={AddSensorContainer} />
          <Route component={HomeContainer} />
        </SharedSnackbarProvider>
      </Router>
    );
  }
}
