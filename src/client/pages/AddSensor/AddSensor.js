import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';


const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
  },
});

export class HomePage extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }


  render() {
    return (

      <div className={this.props.classes.root}>

      </div>
    );
  }
}


export default withStyles(styles)(HomePage);
