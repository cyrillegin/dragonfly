import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = {
  root: {
    margin: '16px',
  },
  graphTitle: {
    marginLeft: '8px',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: '20px',
    marginRight: '20px',
    width: 200,
  },
};

export class SensorDetails extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    name: '',
    description: '',
    coeffiecents: '',
    station: '',
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {

    return (
      <div className={this.props.classes.root}>
        <Paper className={this.props.classes.paper} elevation={4}>
          <Typography variant="headline" component="h3" className={this.props.classes.graphTitle}>
            Sensor Details
          </Typography>

          <div className={this.props.classes.container}>
            <div className={this.props.classes.textField}>UUID: {this.state.uuid}</div>
            <div className={this.props.classes.textField}>Created: {this.state.created}</div>
            <div className={this.props.classes.textField}>Last Modified: {this.state.modified}</div>
          </div>

          <form className={this.props.classes.container} noValidate autoComplete="off">
            <TextField
              id="name"
              label="Name"
              onChange={this.handleChange('name')}
              className={this.props.classes.textField}
              value={this.state.name}
              margin="normal"
            />
            <TextField
              id="description"
              label="Description"
              onChange={this.handleChange('description')}
              className={this.props.classes.textField}
              value={this.state.description}
              margin="normal"
            />
            <TextField
              id="coeffiecents"
              label="Coeffiecents"
              onChange={this.handleChange('coeffiecents')}
              className={this.props.classes.textField}
              value={this.state.coeffiecents}
              margin="normal"
            />
            <TextField
              id="station"
              label="Station"
              onChange={this.handleChange('station')}
              className={this.props.classes.textField}
              value={this.state.station}
              margin="normal"
            />
            <Button className={this.props.classes.button}>Submit Changes</Button>
          </form>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SensorDetails);
