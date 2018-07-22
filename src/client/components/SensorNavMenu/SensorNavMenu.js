import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import ACUnitIcon from '@material-ui/icons/AcUnit';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import MDSpinner from 'react-md-spinner';
import queryString from 'query-string';

const styles = {
  root: {
    width: '100%',
    height: '100%',
  },
  spinner: {
    margin: 'auto',
  },
  sensorListItem: {
    width: '100%',
  },
  sensorStatusOnline: {
    background: 'rgba(21, 234, 21, 1)',
    borderRadius: '5px',
    width: '10px',
    height: '10px',
  },
  sensorStatusError: {
    background: 'red',
    borderRadius: '5px',
    width: '10px',
    height: '10px',
  },
  sensorStatusDisabled: {
    background: 'grey',
    borderRadius: '5px',
    width: '10px',
    height: '10px',
  },
};

export class SensorNavMenu extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    getTree: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  state = {
    loading: true,
    tree: {},
  }

  handleSensorChange(name) {
    const search = queryString.parse(location.search);
    search.sensor = name;
    this.props.history.push({
      search: queryString.stringify(search),
    });
  }

  render() {
    if (this.state.loading) {
      this.props.getTree().then((tree) => {
        this.setState({
          loading: false,
          tree: tree.sensors,
        });
      });
      return (
        <MDSpinner
          className={this.props.classes.spinner}
          size={52} />
      );
    }
    if (this.state.loading === false && Object.keys(this.state.tree).length === 0) {
      return (
        <div />
      );
    }
    const pollerIcon = (icon) => {
      switch (icon) {
        case 'cryptoPoller':
          return (
            <MonetizationOnIcon />
          );
        case 'gpioPoller':
          return (
            <ACUnitIcon />
          );
        default:
          return (
            <ShowChartIcon />
          );
      }
    };
    return (
      <div className={this.props.classes.root}>
        {Object.keys(this.state.tree).map((station, outerIndex) => {
          return (
            <div key={outerIndex}>
              {this.state.tree[station].length > 0 &&
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={this.props.classes.heading}>
                      {station}
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <List component="nav" className={this.props.classes.sensorListItem}>
                      {this.state.tree[station].map((sensor, innerIndex) => {
                        return (
                          <ListItem key={innerIndex} button onClick={() => {
                            this.handleSensorChange(sensor.uuid);
                          }}>

                            <ListItemIcon>
                              {pollerIcon(sensor.poller)}
                            </ListItemIcon>
                            <ListItemText primary={sensor.name} />

                            {sensor.status === 'online' &&
                              <div className={this.props.classes.sensorStatusOnline} />
                            }
                            {sensor.status === 'disabled' &&
                              <div className={this.props.classes.sensorStatusDisabled} />
                            }
                            {sensor.status === 'error' &&
                              <div className={this.props.classes.sensorStatusError} />
                            }

                          </ListItem>
                        );


                      })}
                    </List>

                  </ExpansionPanelDetails>
                </ExpansionPanel>
              }
            </div>
          );
        })}

      </div>

    );
  }
}

export default withStyles(styles)(SensorNavMenu);
