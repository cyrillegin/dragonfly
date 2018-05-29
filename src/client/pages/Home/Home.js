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
    }).isRequired,
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
            history={this.props.history} />

        </Drawer>

        <main className={this.props.classes.content}>
          <SensorGraphContainer
            history={this.props.history} />
          <SensorDetailsContainer />
        </main>
      </div>
    );
  }
}


export default withStyles(styles)(HomePage);
