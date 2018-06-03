import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import SensorNavMenuContainer from './../../components/SensorNavMenu/SensorNavMenuContainer';
import SensorGraphContainer from './../../components/SensorGraph/SensorGraphContainer';
import SensorDetailsContainer from './../../components/SensorDetails/SensorDetailsContainer';

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
  },
  drawerRoot: {
    width: '25%',
  },
  drawerPaper: {
    position: 'relative',
    width: '100%',
    zIndex: 1000,
  },
  content: {
    flexGrow: 1,
    minWidth: 0, // So the Typography noWrap works
  },
});

export class HomePage extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
      location: PropTypes.shape({
        search: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    getSensor: PropTypes.func.isRequired,
  }

  state = {
    loading: true,
    sensor: null,
  }

  getUUIDFromURL() {
    const search = this.props.history.location.search;
    const start = search.indexOf('sensor=');
    let end = search.substring(start, search.length).indexOf('&');
    end = end > 0 ? end : search.length;
    return search.substring(start, end).split('=')[1] || '';
  }
  componentDidUpdate(prev) {
    const sensorUUID = this.getUUIDFromURL();
    if (this.state.loading === false && this.state.sensor !== null && sensorUUID !== this.state.sensor.uuid) {
      this.setState({
        loading: true,
      });
    }
  }

  render() {
    const sensorUUID = this.getUUIDFromURL();

    if (this.state.loading && sensorUUID !== '') {
      this.props.getSensor().then((data) => {
        this.setState({
          sensor: data[0],
          loading: false,
        });
      });
    }

    return (
      <div className={this.props.classes.root}>
        <Drawer
          variant="permanent"
          className={this.props.classes.drawerRoot}
          classes={{paper: this.props.classes.drawerPaper}}
        >
          <SensorNavMenuContainer
            history={this.props.history}
            sensorUUID={sensorUUID}
          />
        </Drawer>

        <main className={this.props.classes.content}>
          <SensorGraphContainer
            sensor={this.state.sensor}
            history={this.props.history}
          />
          <SensorDetailsContainer
            sensor={this.state.sensor}
            history={this.props.history}
          />
        </main>
      </div>
    );
  }
}


export default withStyles(styles)(HomePage);
