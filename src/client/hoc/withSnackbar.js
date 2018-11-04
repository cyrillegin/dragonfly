import React, { Component } from 'react';
import { SnackbarConsumer } from '../components/snackbar/snackbar';

export default function withSnackbar(Comp, selectData) {
  return class snacks extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <SnackbarConsumer>
          {({ openSnackbar }) => <Comp openSnackbar={openSnackbar} {...this.props} />}
        </SnackbarConsumer>
      );
    }
  };
}
