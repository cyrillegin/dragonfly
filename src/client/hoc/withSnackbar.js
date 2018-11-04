import React, { Component } from 'react';
import { SharedSnackbarConsumer } from '../components/snackbar/sharedSnackbar';

export default function withSnackbar(Comp, selectData) {
  return class snacks extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <SharedSnackbarConsumer>
          {({ openSnackbar }) => <Comp openSnackbar={openSnackbar} {...this.props} />}
        </SharedSnackbarConsumer>
      );
    }
  };
}
