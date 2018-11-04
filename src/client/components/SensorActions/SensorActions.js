import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import WifiIcon from '@material-ui/icons/Wifi';
import ActionDialog from './ActionDialog';

const styles = {
  root: {
    margin: '16px',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
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
    updateAction: PropTypes.func.isRequired,
    deleteAction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sensor: null,
  };

  state = {
    uuid: '',
    loading: true,
    addActionDialogIsOpen: false,
    updateActionDialogIsOpen: false,

    checked: ['wifi'],
    action: null,
  };

  componentDidUpdate(prev) {
    if (
      (prev.sensor === null && this.props.sensor !== null) ||
      (prev.sensor !== null && prev.sensor.uuid !== this.props.sensor.uuid)
    ) {
      this.setState({
        uuid: this.props.sensor.uuid || '',
      });
    }
  }

  loadData() {
    this.props.getActions().then(actions => {
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
    if (
      this.props.sensor === null ||
      this.props.sensor.uuid === '' ||
      this.props.sensor.uuid === null
    ) {
      return <div />;
    } else if (this.state.loading) {
      this.loadData();
      return <div />;
    }

    const openAddActionDialog = () => {
      this.setState({
        addActionDialogIsOpen: true,
      });
    };

    const closeActionDialog = () => {
      this.setState({
        addActionDialogIsOpen: false,
        updateActionDialogIsOpen: false,
      });
    };

    const handleToggle = value => () => {
      const { checked } = this.state;
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      this.setState({
        checked: newChecked,
      });
    };

    return (
      <div className={this.props.classes.root}>
        {/* Add Action Dialog */}
        <ActionDialog
          dialogIsOpen={this.state.addActionDialogIsOpen}
          actionCancel={closeActionDialog}
          actionSubmit={this.props.addAction}
          title={'Add Sensor'}
          update={false}
          sensor={this.state.uuid}
        />

        {/* Update Action Dialog */}
        <ActionDialog
          dialogIsOpen={this.state.updateActionDialogIsOpen}
          actionCancel={closeActionDialog}
          actionSubmit={this.props.updateAction}
          actionDelete={this.props.deleteAction}
          title={'Update Sensor'}
          update={true}
          sensor={this.state.uuid}
          action={this.state.action}
        />

        <Paper className={this.props.classes.paper} elevation={4}>
          <Typography variant="headline" component="h3">
            Sensor Actions
          </Typography>
          <hr />
          {this.state.actions.length === 0 && (
            <Typography variant="headline" component="h4" className={this.props.classes.centered}>
              No actions currently exist for this sensor.
            </Typography>
          )}
          {this.state.actions.length > 0 && (
            <List subheader={<ListSubheader>Actions</ListSubheader>}>
              {this.state.actions.map(action => (
                <ListItem key={action.uuid}>
                  <ListItemIcon>
                    <WifiIcon />
                  </ListItemIcon>
                  <ListItemText primary={action.plugin} />
                  <ListItemSecondaryAction>
                    <Switch
                      onChange={handleToggle('wifi')}
                      checked={this.state.checked.indexOf('wifi') !== -1}
                    />
                    <Button
                      className={this.props.classes.button}
                      onClick={() => {
                        this.setState({
                          updateActionDialogIsOpen: true,
                          action: action,
                        });
                      }}
                    >
                      Update
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
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
