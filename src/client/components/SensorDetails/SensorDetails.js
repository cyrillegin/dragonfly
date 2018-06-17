import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
    deleteSensor: PropTypes.func.isRequired,
    sensor: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      created: PropTypes.number.isRequired,
      modified: PropTypes.number.isRequired,
      poller: PropTypes.string.isRequired,
      pin: PropTypes.string.isRequired,
      pollRate: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      station: PropTypes.string.isRequired,
      description: PropTypes.string,
      coefficients: PropTypes.string,
      units: PropTypes.string,
      endpoint: PropTypes.string,
    }),
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
    pollRate: '',
    status: '',
    localIP: '',
    loading: true,
    deleteDialogIsOpen: false,
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
        pollRate: this.props.sensor.pollRate || '',
        status: this.props.sensor.status || '',
      });
    }
  }

  componentDidMount() {
    fetch('/getIP')
      .then(response => response.json())
      .then((data) => {
        this.setState({
          localIP: data.localIP,
        });
      });
  }

  render() {
    const updateSensor = () => {
      this.props.updateSensor({
        uuid: this.state.uuid,
        name: this.state.name,
        description: this.state.description,
        coefficients: this.state.coefficients,
        station: this.state.station,
        poller: this.state.poller,
        pin: this.state.pin,
        units: this.state.units,
        endpoint: this.state.endpoint,
        pollRate: this.state.pollRate,
        status: this.state.status,
      });
    };

    const openDeleteSensorDialog = () => {
      this.setState({
        deleteDialogIsOpen: true,
      });
    };

    const closeDeleteSensorDialog = () => {
      this.setState({
        deleteDialogIsOpen: false,
      });
    };

    const handleDeleteSensor = () => {
      this.props.deleteSensor().then((res) => {
        closeDeleteSensorDialog();
      });
    };

    if (this.state.loading) {
      return (<div />);
    } else if (this.props.sensor.uuid === '' || this.props.sensor.uuid === null) {
      return (<div />);
    }
    return (
      <div className={this.props.classes.root}>

        <Dialog
          open={this.state.deleteDialogIsOpen}
          onClose={closeDeleteSensorDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Delete Sensor?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this sensor?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteSensor} color="primary">
              Yes
            </Button>
            <Button onClick={closeDeleteSensorDialog} color="primary" autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>


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
              label="Last Modified"
              className={this.props.classes.textField}
              value={new Date(this.state.modified).toGMTString()}
              margin="normal"
              disabled
            />
            <TextField
              id="localip"
              label="Local IP Address"
              className={this.props.classes.textField}
              value={this.state.localIP}
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
              id="pollRate"
              label="Poll Rate"
              onChange={this.handleChange('pollRate')}
              className={this.props.classes.textField}
              value={this.state.pollRate}
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
            <TextField
              id="status"
              label={'Status'}
              onChange={this.handleChange('status')}
              className={this.props.classes.textField}
              value={this.state.status}
              margin="normal"
            />
            <Button className={this.props.classes.button} onClick={updateSensor}>Submit Changes</Button>
            <Button className={this.props.classes.button} onClick={openDeleteSensorDialog}>Delete Sensor</Button>
          </form>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SensorDetails);
