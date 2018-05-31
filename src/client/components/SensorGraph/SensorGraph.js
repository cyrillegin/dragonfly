import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MDSpinner from 'react-md-spinner';
import Graph from './Graph';

const styles = {
  root: {
    margin: '16px',

  },
  paper: {
    padding: '20px',
    textAlign: 'center',
  },
  graphTitle: {
    marginLeft: '8px',
    textAlign: 'center',
  },
  spinner: {
    margin: 'auto',
  },
};

export class SensorGraph extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    getReadings: PropTypes.func.isRequired,
    sensor: PropTypes.string.isRequired,
  };

  state = {
    loading: true,
    readings: [],
    sensor: '',
  }

  loadData() {
    this.props.getReadings().then((readings) => {
      this.setState({
        loading: false,
        readings: readings,
        sensor: this.props.sensor,
      });
    });
  }

  componentDidUpdate(prev) {
    if (this.props.sensor !== '' && this.props.sensor !== this.state.sensor) {
      this.setState({
        loading: true,
        sensor: this.props.sensor,
      });
      this.loadData();
    }
  }

  render() {
    if (this.state.loading && this.props.sensor !== '') {
      this.loadData();
      return (
        <div className={this.props.classes.root}>
          <Paper className={this.props.classes.paper} elevation={4}>
            <MDSpinner
              className={this.props.classes.spinner}
              size={52} />
          </Paper>
        </div>
      );
    }
    return (
      <div className={this.props.classes.root}>
        <Paper className={this.props.classes.paper} elevation={4}>
          {this.props.sensor === '' &&
            <Typography variant="headline" component="h3" className={this.props.classes.graphTitle}>
              Please select a sensor.
            </Typography>
          }
          {this.props.sensor !== '' &&
            <div>
              <Typography variant="headline" component="h3" className={this.props.classes.graphTitle}>
                  Sensor name
              </Typography>
              <Graph
                units={'unit'}
                readings={this.state.readings}
              />
            </div>
          }
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SensorGraph);
