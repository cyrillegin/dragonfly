import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
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
  centered: {
    textAlign: 'center',
  },
};

export class SensorActions extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    sensor: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
    }),
    getActions: PropTypes.func.isRequired,
    addAction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sensor: null,
  }

  state = {
    uuid: '',
    loading: true,
    addActionDialogIsOpen: false,

    plugin: '',
    meta: '',
    pollRate: '',
    notificationRate: '',
    operator: '',
    value: '',
  }


  componentDidUpdate(prev) {
    if ((prev.sensor === null && this.props.sensor !== null) ||
    (prev.sensor !== null && prev.sensor.uuid !== this.props.sensor.uuid)) {
      this.setState({
        uuid: this.props.sensor.uuid || '',
      });
    }
  }

  loadData() {
    this.props.getActions().then((actions) => {
      this.setState({
        actions: actions,
        loading: false,
      });
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    if (this.props.sensor === null || this.props.sensor.uuid === '' || this.props.sensor.uuid === null) {
      return (<div />);
    } else if (this.state.loading) {
      this.loadData();
      return (<div />);
    }

    const openAddActionDialog = () => {
      this.setState({
        addActionDialogIsOpen: true,
      });
    };

    const closeAddActionDialog = () => {
      this.setState({
        addActionDialogIsOpen: false,
      });
    };

    const handleAddActionSubmit = () => {
      this.props.addAction({
        sensor: this.state.uuid,
        plugin: this.state.plugin,
        meta: this.state.meta,
        pollRate: this.state.pollRate,
        notificationRate: this.state.notificationRate,
        operator: this.state.operator,
        value: this.state.value,

      });
    };

    return (
      <div className={this.props.classes.root}>

        <Dialog
          open={this.state.addActionDialogIsOpen}
          onClose={closeAddActionDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Add Action'}</DialogTitle>

          <DialogContent>
            <form className={this.props.classes.container} noValidate autoComplete="off">
              <TextField
                id="plugin"
                label="Plugin"
                onChange={this.handleChange('plugin')}
                className={this.props.classes.textField}
                value={this.state.plugin}
                margin="normal"
              />
              <TextField
                id="meta"
                label="Meta"
                onChange={this.handleChange('meta')}
                className={this.props.classes.textField}
                value={this.state.meta}
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
                id="notificationRate"
                label="Notification Rate"
                onChange={this.handleChange('notificationRate')}
                className={this.props.classes.textField}
                value={this.state.notificationRate}
                margin="normal"
              />
              <TextField
                id="operator"
                label="Operator"
                onChange={this.handleChange('operator')}
                className={this.props.classes.textField}
                value={this.state.operator}
                margin="normal"
              />
              <TextField
                id="value"
                label="Value"
                onChange={this.handleChange('value')}
                className={this.props.classes.textField}
                value={this.state.value}
                margin="normal"
              />

            </form>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleAddActionSubmit} color="primary">
            Submit
            </Button>
            <Button onClick={closeAddActionDialog} color="primary" autoFocus>
            Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Paper className={this.props.classes.paper} elevation={4}>
          <Typography variant="headline" component="h3">
            Sensor Actions
          </Typography>
          <hr />
          {this.state.actions.length === 0 &&
            <Typography variant="headline" component="h4" className={this.props.classes.centered}>
            No actions currently exist for this sensor.
            </Typography>
          }
          {this.state.actions.length > 0 &&
            <div>
            have an action
            </div>
          }
          <Button className={this.props.classes.button} onClick={openAddActionDialog}>
            <AddIcon />
            Add Action

          </Button>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SensorActions);
