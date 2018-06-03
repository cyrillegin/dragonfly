import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
// import PropTypes from 'prop-types';
import HomeContainer from './../pages/Home/HomeContainer';
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

        </div>
      </Router>
    );
  }
}
