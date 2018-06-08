import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MDSpinner from 'react-md-spinner';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
  timeControls: {
    textAlign: 'right',
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
    console.log(this.props.sensor);
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
    console.log(this.state);
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
        startTime: new Date(event.target.value).getTime(),
      });
    };

    const setEndTime = event => {
      this.setState({
        endTime: new Date(event.target.value).getTime(),
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

          <form className={this.props.classes.timeControls} noValidate>
            <TextField
              id="datetime-start"
              label="Start Time"
              type="datetime-local"
              defaultValue="2017-05-24T10:30"
              className={this.props.classes.textField}
              onChange={setStartTime}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="datetime-end"
              label="End Time"
              type="datetime-local"
              defaultValue="2017-05-24T10:30"
              className={this.props.classes.textField}
              onChange={setEndTime}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Button onClick={submitTime}>Submit Changes</Button>
          </form>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SensorGraph);
