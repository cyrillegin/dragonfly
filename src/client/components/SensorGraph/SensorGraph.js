import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MDSpinner from 'react-md-spinner';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Datetime from 'react-datetime';
import Graph from './Graph';
import './timepicker.scss';


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
  timeControls: {
    textAlign: 'right',
    width: '100%',
    display: 'inline-block',
    margin: '10px',
  },
  textField: {
    margin: '12px',
  },
};

export class SensorGraph extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    getReadings: PropTypes.func.isRequired,
    submitTime: PropTypes.func.isRequired,
    sensor: PropTypes.object,
    currentStartTime: PropTypes.number,
    currentEndTime: PropTypes.number,
  };

  static defaultProps = {
    sensor: null,
  }

  state = {
    loading: true,
    readings: [],
    startTime: null,
    endTime: null,
  }

  constructor(props) {
    super(props);

    this.state.startTime = props.currentStartTime || moment().unix() * 1000 - 24 * 60 * 60 * 1000;
    this.state.endTime = props.currentEndTime || moment().unix() * 1000;
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

    const setStartTime = event => {
      this.setState({
        startTime: event.unix() * 1000,
      });
    };

    const setEndTime = event => {
      this.setState({
        endTime: event.unix() * 1000,
      });
    };

    const submitTime = () => {
      this.props.submitTime(this.state.startTime, this.state.endTime);
      this.setState({
        loading: true,
        readings: [],
      });
    };

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

          <div className={this.props.classes.timeControls}>
            Start Time
            <Datetime
              onChange={setStartTime}
              value={this.state.startTime} />
            End Time
            <Datetime
              onChange={setEndTime}
              value={this.state.endTime} />
            <Button onClick={submitTime}>Submit Changes</Button>
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SensorGraph);
