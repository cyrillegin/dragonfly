import React, { Component, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { SharedSnackbarProvider } from '../components/snackbar/snackbar';

const HomeContainer = lazy(() => import('./../pages/Home/HomeContainer'));
const AddSensorContainer = lazy(() => import('./../pages/AddSensor/AddSensorContainer'));
const NavBar = lazy(() => import('./../components/NavBar/NavBarContainer'));

export default class App extends Component {
  static propTypes = {};

  render() {
    return (
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <SharedSnackbarProvider>
            <NavBar />
            <Route exact path="/addsensors" component={AddSensorContainer} />
            <Route exact path="/" component={HomeContainer} />
          </SharedSnackbarProvider>
        </Suspense>
      </Router>
    );
  }
}
