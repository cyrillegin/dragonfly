import { compose, mapProps } from 'recompose';
import NavBar from './NavBar';

export default compose(
  mapProps(ownProps => {
    const version = '0.0.0';

    return {
      version,
      getVersion: () => {
        return new Promise((res, rej) => {
          fetch('/version')
            .then(response => response.json())
            .then(response => res(response.version));
        });
      },
    };
  }),
)(NavBar);
