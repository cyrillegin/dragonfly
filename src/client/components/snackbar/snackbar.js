import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Snackbar } from '@material-ui/core';
import { Close } from '@material-ui/icons';

const SharedSnackbarContext = React.createContext();

const messages = {};

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
      <SharedSnackbarContext.Provider
        value={{
          openSnackbar: this.openSnackbar,
          closeSnackbar: this.closeSnackbar,
          snackbarIsOpen: this.state.isOpen,
          message: this.state.message,
        }}
      >
        <SharedSnackbarConsumer>
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
        </SharedSnackbarConsumer>

        {children}
      </SharedSnackbarContext.Provider>
    );
  }
}

export const SharedSnackbarConsumer = SharedSnackbarContext.Consumer;
