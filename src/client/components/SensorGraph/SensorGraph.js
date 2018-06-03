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
    textAlign: 'left',
  },
  spinner: {
    margin: 'auto',
  },
};

export class SensorGraph extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    getReadings: PropTypes.func.isRequired,
    sensor: PropTypes.object,
  };

  static defaultProps = {
    sensor: null,
  }

  state = {
    loading: true,
    readings: [],
  }

  loadData() {
    this.props.getReadings().then((readings) => {
      this.setState({
        loading: false,
        readings: readings,
      });
    });
  }

  componentDidUpdate(prev) {
    if (this.state.loading === false &&
      this.props.sensor !== null &&
      this.props.sensor.uuid !== '' &&
      prev.sensor.uuid !== this.props.sensor.uuid
    ) {
      this.setState({
        loading: true,
      });
    }
  }

  render() {

    if (this.props.sensor === null) {
      return (
        <div className={this.props.classes.root}>
          <Paper className={this.props.classes.paper} elevation={4}>
            <Typography variant="headline" component="h3" className={this.props.classes.graphTitle}>
            Please select a sensor.
            </Typography>
          </Paper>
        </div>
      );
    }
    if (this.state.loading === true) {
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
          <Typography variant="headline" component="h3" className={this.props.classes.graphTitle}>
            {this.props.sensor.name}
          </Typography>
          <Graph
            sensor={this.props.sensor}
            readings={this.state.readings}
          />

        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SensorGraph);
