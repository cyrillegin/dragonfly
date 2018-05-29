import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    flexGrow: 1,
    marginRight: '-16px',
    marginLeft: '-16px',
    marginTop: '-8px',
    display: 'flex',
  },
  flex: {
    flex: 1,
  },
};

export class NavBar extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {

    return (
      <div className={this.props.classes.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit" className={this.props.classes.flex}>
            Dragonfly
            </Typography>


            <Link to="/">
              <Button>
              Home
              </Button>
            </Link>
            <Link to="/sensors">
              <Button>
              Add Sensor
              </Button>
            </Link>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(NavBar);
