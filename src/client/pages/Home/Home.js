import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import queryString from 'query-string';
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
    sensor: null,
  }

  componentDidUpdate(prev) {
    const search = queryString.parse(location.search);
    if ((search.sensor && this.state.sensor === null) || search.sensor !== this.state.sensor.uuid) {
      this.props.getSensor().then((data) => {
        this.setState({
          sensor: data[0],
        });
      });
    }
  }

  componentDidMount() {
    if (queryString.parse(location.search).sensor) {
      this.props.getSensor().then((data) => {
        this.setState({
          sensor: data[0],
        });
      });
    }
  }

  render() {

    return (
      <div className={this.props.classes.root}>
        <Drawer
          variant="permanent"
          className={this.props.classes.drawerRoot}
          classes={{paper: this.props.classes.drawerPaper}}
        >
          <SensorNavMenuContainer
            history={this.props.history}
            sensor={this.state.sensor}
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
