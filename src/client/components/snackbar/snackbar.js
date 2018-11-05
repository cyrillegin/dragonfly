import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';

const SnackbarContext = React.createContext();

const messages = {
  'reading-added': 'Reading added to sensor.',
  'sensor-update': 'Sensor has been updated',
  'sensor-delete': 'Sensor has been deleted',
};

export class SharedSnackbarProvider extends Component {
  static propTypes = {
    children: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      message: '',
    };
  }

  openSnackbar = msg => {
    let message;
    if (msg in messages) {
      message = messages[msg];
    } else {
      message = 'An unknown error has occured. Check your console for more details.';
      console.error(msg);
    }
    this.setState({
      message,
      isOpen: true,
    });
  };

  closeSnackbar = () => {
    // Use a timeout to wait for the transition to end.
    setTimeout(() => {
      this.setState({
        message: '',
        isOpen: false,
      });
    }, 1000);
  };

  render() {
    const { children } = this.props;

    return (
      <SnackbarContext.Provider
        value={{
          openSnackbar: this.openSnackbar,
          closeSnackbar: this.closeSnackbar,
          snackbarIsOpen: this.state.isOpen,
          message: this.state.message,
        }}
      >
        <SnackbarConsumer>
          {({ snackbarIsOpen, message, closeSnackbar }) => (
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={snackbarIsOpen}
              autoHideDuration={6000}
              onClose={closeSnackbar}
              message={message}
              action={[
                <IconButton key="close" color="inherit" onClick={closeSnackbar}>
                  <Close />
                </IconButton>,
              ]}
            />
          )}
        </SnackbarConsumer>

        {children}
      </SnackbarContext.Provider>
    );
  }
}

export const SnackbarConsumer = SnackbarContext.Consumer;
