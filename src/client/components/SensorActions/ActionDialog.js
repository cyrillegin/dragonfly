import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = {
  textField: {
    margin: '20px',
    width: '250px',
  },
};

export class ActionDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dialogIsOpen: PropTypes.bool.isRequired,
    sensor: PropTypes.string,
    actionCancel: PropTypes.func.isRequired,
    actionSubmit: PropTypes.func.isRequired,
    actionDelete: PropTypes.func,
    title: PropTypes.string.isRequired,
    update: PropTypes.bool.isRequired,
    action: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      plugin: PropTypes.string.isRequired,
      meta: PropTypes.string.isRequired,
      notificationRate: PropTypes.string.isRequired,
      operator: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
    actionList: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  state = {
    plugin: '',
    meta: '',
    notificationRate: '',
    operator: '',
    value: '',
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.update && !this.state.isUpdate && nextProps.action) {
      this.setState({
        isUpdate: true,
        plugin: nextProps.action.plugin,
        meta: nextProps.action.meta,
        notificationRate: nextProps.action.notificationRate,
        operator: nextProps.action.operator,
        value: nextProps.action.value,
      });
    } else if (this.state.plugin === '') {
      this.setState({
        plugin: this.props.actionList[0],
        meta: 'hello',
        notificationRate: 60 * 60,
        operator: '>',
        value: 5,
      });
    }
    return true;
  }

  render() {
    const handleActionSubmit = () => {
      this.props.actionSubmit({
        sensor: this.props.sensor,
        uuid: this.props.action && this.props.action.uuid,
        plugin: this.state.plugin,
        meta: this.state.meta,
        notificationRate: this.state.notificationRate,
        operator: this.state.operator,
        value: this.state.value,
      });
    };

    const handleActionDelete = () => {
      this.props.actionDelete({
        sensor: this.props.sensor,
        action: this.props.action.uuid,
      });
    };

    return (
      <Dialog
        open={this.props.dialogIsOpen}
        onClose={this.props.actionCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>

        <DialogContent>
          <form className={this.props.classes.container} noValidate autoComplete="off">
            <Select
              id="plugin"
              label="Plugin"
              onChange={this.handleChange('plugin')}
              className={this.props.classes.textField}
              value={this.state.plugin}
            >
              {this.props.actionList.map(action => (
                <MenuItem key={action} value={action}>
                  {action}
                </MenuItem>
              ))}
            </Select>
            <TextField
              id="meta"
              label="Meta"
              onChange={this.handleChange('meta')}
              className={this.props.classes.textField}
              value={this.state.meta}
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
          {this.props.update === false && (
            <Button onClick={handleActionSubmit} color="primary">
              Submit
            </Button>
          )}
          {this.props.update && (
            <div>
              <Button onClick={handleActionSubmit} color="primary">
                Update
              </Button>
              <Button onClick={handleActionDelete} color="primary" autoFocus>
                Delete
              </Button>
            </div>
          )}
          <Button onClick={this.props.actionCancel} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ActionDialog);
