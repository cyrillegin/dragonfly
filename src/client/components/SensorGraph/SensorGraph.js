import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MDSpinner from 'react-md-spinner';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Datetime from 'react-datetime';
import Graph from './Graph';
import './timepicker.css';


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
    flexGrow: '1',
    display: 'inline-block',
    margin: '10px',
  },
  textField: {
    margin: '12px',
  },
  statsContianer: {
    textAlign: 'left',
  },
  extras: {
    display: 'flex',
  },
  list: {
    listStyleType: 'none',
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
    status: null,
    autoRefresh: 'false',
  }

  constructor(props) {
    super(props);

    this.state.startTime = props.currentStartTime || moment().unix() * 1000 - 24 * 60 * 60 * 1000;
    this.state.endTime = props.currentEndTime || moment().unix() * 1000;
  }

  loadData() {
    this.props.getReadings().then((readings) => {
      const stats = {
        max: readings[0].value,
        min: readings[0].value,
        avg: 0,
        count: readings.length,
        last: readings[readings.length - 1].value,
      };
      readings.forEach((reading) => {
        stats.avg += reading.value;
        if (stats.max < reading.value) {
          stats.max = reading.value;
        }
        if (stats.min > reading.value) {
          stats.min = reading.value;
        }
      });
      const coef = {
        x: 1,
        y: 0,
      };
      stats.avg = ((stats.avg / readings.length) * coef.x + coef.y).toFixed(2);
      stats.max = stats.max * coef.x + coef.y;
      stats.min = stats.min * coef.x + coef.y;

      this.setState({
        loading: false,
        readings: readings,
        stats: stats,
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

    const handleAutoRefresh = event => {
      this.setState({
        autoRefresh: event.target.checked + '',
      });
    };

    if (this.state.autoRefresh === 'true') {
      if (!this.autoRefreshTimer) {
        this.autoRefreshTimer = setInterval(() => {
          this.loadData();
        }, 60 * 1000);
      }
    } else if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = null;
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
          <div className={this.props.classes.extras}>
            <div className={this.props.classes.statsContianer}>
              <table>
                <tbody>
                  <tr>
                    <td>Min: </td>
                    <td>{this.state.stats.min}</td>
                  </tr>
                  <tr>
                    <td>Max:</td>
                    <td>{this.state.stats.max}</td>
                  </tr>
                  <tr>
                    <td>Avg:</td>
                    <td>{this.state.stats.avg}</td>
                  </tr>
                  <tr>
                    <td>Last:</td>
                    <td> {this.state.stats.last}</td>
                  </tr>
                  <tr>
                    <td>Count:</td>
                    <td> {this.state.stats.count}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={this.props.classes.timeControls}>
              <ul className={this.props.classes.list}>
                <li>
              Start Time
                  <Datetime
                    onChange={setStartTime}
                    value={this.state.startTime}
                    inputProps={{'aria-label': 'start time'}} />
                End Time
                  <Datetime
                    onChange={setEndTime}
                    value={this.state.endTime}
                    inputProps={{'aria-label': 'end time'}} />
                  <Button onClick={submitTime}>Submit Changes</Button>
                </li>
                <li>
                  AutoRefresh
                  <Switch value={this.state.autoRefresh} onChange={handleAutoRefresh} />
                  <Button onClick={() => {
                    this.loadData();
                  }}>Refresh Now</Button>
                </li>
              </ul>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SensorGraph);
