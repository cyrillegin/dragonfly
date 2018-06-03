import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MDSpinner from 'react-md-spinner';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
  },
  fullPaper: {
    width: '100%',
    margin: '32px 64px',
    padding: '16px',
    transition: '500ms',
  },
  leftPaper: {
    width: '33%',
    margin: '32px 0 32px 32px',
    padding: '16px',
    transition: '500ms',
  },
  rightPaper: {
    width: '100%',
    margin: '32px 32px',
    padding: '16px',
    transition: '500ms',
  },
  textField: {
    width: '100%',
  },
  title: {},
});

export class HomePage extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    getPlugins: PropTypes.func.isRequired,
    testPlugin: PropTypes.func.isRequired,
    submitPlugin: PropTypes.func.isRequired,
  }

  state = {
    loading: true,
    plugins: null,
    selectedPlugin: '',
    name: '',
    description: '',
    coefficients: '',
    station: '',
    poller: '',
    pin: '',
    units: '',
    endpoint: '',
  }

  handlePluginSelect(name) {
    this.setState({
      selectedPlugin: name,
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };


  render() {
    if (this.state.loading) {
      this.props.getPlugins().then((data) => {
        this.setState({
          loading: false,
          plugins: data.plugins,
        });
      });
      return (
        <MDSpinner
          className={this.props.classes.spinner}
          size={52} />
      );
    }

    const submitSensor = () => {
      console.log('submitting');
      this.props.submitPlugin(
        this.state.selectedPlugin,
        {
          name: this.state.name,
          description: this.state.description,
          coefficients: this.state.coefficients,
          station: this.state.station,
          pollRate: this.state.pollRate,
          pin: this.state.pin,
          units: this.state.units,
          endpoint: this.state.endpoint,
        },
      );
    };

    const testSensor = () => {
      this.props.testPlugin(
        this.state.selectedPlugin,
        {
          name: this.state.name,
          description: this.state.description,
          coefficients: this.state.coefficients,
          station: this.state.station,
          pollRate: this.state.pollRate,
          pin: this.state.pin,
          units: this.state.units,
          endpoint: this.state.endpoint,
        },
      ).then((data) => {
        this.setState({
          testResult: data,
        });
      });
    };

    return (
      <div className={this.props.classes.root}>
        <Paper className={
          this.state.selectedPlugin === '' ?
            this.props.classes.fullPaper :
            this.props.classes.leftPaper
        } elevation={4}>
          <Typography variant="headline" component="h3" className={this.props.classes.title}>
            Plugins
          </Typography>

          <List component="nav" className={this.props.classes.pluginsList}>
            {this.state.plugins.map((plugin, index) => {
              return (
                <ListItem key={index} button onClick={() => {
                  this.handlePluginSelect(plugin);
                }}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={plugin} />
                </ListItem>
              );
            })}
          </List>
        </Paper>
        {this.state.selectedPlugin !== '' &&
        <Paper className={this.props.classes.rightPaper}>
          <Typography variant="headline" component="h3" className={this.props.classes.title}>
            Details
          </Typography>
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
            <Button className={this.props.classes.button} onClick={testSensor}>Test Sensor</Button>
            <Button
              disabled={!(this.state.testResult && this.state.testResult.sensor)}
              className={this.props.classes.button}
              onClick={submitSensor}
            >
              Submit Sensor
            </Button>
          </form>
          {this.state.testResult &&
            <div>
              {this.state.testResult.error &&
              <div>
                <Typography variant="headline" component="h3" className={this.props.classes.title}>
                An Error has occured while testing the sensor
                </Typography>
                <Typography variant="headline" component="h5" className={this.props.classes.title}>
                  {this.state.testResult.error}
                </Typography>
              </div>
              }
              {this.state.testResult.sensor &&
                <div>
                  <Typography variant="headline" component="h3" className={this.props.classes.title}>
                  Test succesful!
                  </Typography>
                  <Typography variant="headline" component="h5" className={this.props.classes.title}>
                    {JSON.stringify(this.state.testResult)}
                  </Typography>
                </div>
              }
            </div>
          }
        </Paper>
        }
      </div>
    );
  }
}


export default withStyles(styles)(HomePage);
