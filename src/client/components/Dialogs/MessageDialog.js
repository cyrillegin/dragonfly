import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

const styles = {
  'root': {

  },
};

export class MessageDialog extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onAccept: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    contentText: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.onAccept}
          onClick={event => {
            event.nativeEvent.stopImmediatePropagation();
          }}
        >
          <DialogTitle>{this.props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{this.props.contentText}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onAccept} color="primary">
              Okay
            </Button>

          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(MessageDialog);
