import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
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
  },
  spinner: {
    margin: 'auto',
  },
  sensorListItem: {
    width: '100%',
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
                              <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary={sensor.name} />
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
