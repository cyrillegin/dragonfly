import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = {
  root: {
    margin: '16px',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    margin: '20px',
    width: '250px',
  },
  paper: {
    padding: '20px',
  },
};

export class SensorDetails extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    updateSensor: PropTypes.func.isRequired,
    sensor: PropTypes.object,
  };

  static defaultProps = {
    sensor: null,
  }

  state = {
    uuid: '',
    name: '',
    description: '',
    coefficients: '',
    station: '',
    poller: '',
    pin: '',
    units: '',
    endpoint: '',
    loading: true,
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };


  componentDidUpdate(prev) {

    if ((prev.sensor === null && this.props.sensor !== null) ||
    (prev.sensor !== null && prev.sensor.uuid !== this.props.sensor.uuid)) {
      this.setState({
        loading: false,
        uuid: this.props.sensor.uuid || '',
        created: this.props.sensor.created || '',
        modified: this.props.sensor.modified || '',
        name: this.props.sensor.name || '',
        description: this.props.sensor.description || '',
        coefficients: this.props.sensor.coefficients || '',
        station: this.props.sensor.station || '',
        poller: this.props.sensor.poller || '',
        pin: this.props.sensor.pin || '',
        units: this.props.sensor.units || '',
        endpoint: this.props.sensor.endpoint || '',
      });
    }
  }

  render() {
    const updateSensor = () => {
      const {loading, ...sensor} = this.state; // eslint-disable-line
      this.props.updateSensor(sensor);
    };

    if (this.state.loading) {
      return (<div />);
    } else if (this.props.sensor.uuid === '' || this.props.sensor.uuid === null) {
      return (<div />);
    }
    return (
      <div className={this.props.classes.root}>
        <Paper className={this.props.classes.paper} elevation={4}>
          <Typography variant="headline" component="h3">
            Sensor Details
          </Typography>
          <hr />
          <div className={this.props.classes.container}>
            <TextField
              id="uuid"
              label="UUID"
              className={this.props.classes.textField}
              value={this.state.uuid}
              margin="normal"
              disabled
            />
            <TextField
              id="created"
              label="Created"
              className={this.props.classes.textField}
              value={new Date(this.state.created).toGMTString()}
              margin="normal"
              disabled
            />
            <TextField
              id="modified"
              label="Las Modified"
              className={this.props.classes.textField}
              value={new Date(this.state.modified).toGMTString()}
              margin="normal"
              disabled
            />
          </div>

          <form className={this.props.classes.container} noValidate autoComplete="off">
            <TextField
              id="name"
              label="Name"
              onChange={this.handleChange('name')}
              className={this.props.classes.textField}
              value={this.state.name}
              margin="normal"
            />
            <TextField
              id="description"
              label="Description"
              onChange={this.handleChange('description')}
              className={this.props.classes.textField}
              value={this.state.description}
              margin="normal"
            />
            <TextField
              id="coefficients"
              label="Coefficients"
              onChange={this.handleChange('coefficients')}
              className={this.props.classes.textField}
              value={this.state.coefficients}
              margin="normal"
            />
            <TextField
              id="station"
              label="Station"
              onChange={this.handleChange('station')}
              className={this.props.classes.textField}
              value={this.state.station}
              margin="normal"
            />
            <TextField
              id="poller"
              label="Poller"
              onChange={this.handleChange('poller')}
              className={this.props.classes.textField}
              value={this.state.poller}
              margin="normal"
            />
            <TextField
              id="pin"
              label="Pin"
              onChange={this.handleChange('pin')}
              className={this.props.classes.textField}
              value={this.state.pin}
              margin="normal"
            />
            <TextField
              id="units"
              label="Units"
              onChange={this.handleChange('units')}
              className={this.props.classes.textField}
              value={this.state.units}
              margin="normal"
            />
            <TextField
              id="endpoint"
              label={'Endpoint'}
              onChange={this.handleChange('endpoint')}
              className={this.props.classes.textField}
              value={this.state.endpoint}
              margin="normal"
            />
            <Button className={this.props.classes.button} onClick={updateSensor}>Submit Changes</Button>
          </form>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SensorDetails);
