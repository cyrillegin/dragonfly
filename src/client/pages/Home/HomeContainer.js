import {compose, mapProps} from 'recompose';
import Home from './Home';

export default compose(
  mapProps((ownProps) => {
    return {
      history: ownProps.history,
      getSensor: () => {
        return new Promise((res, rej) => {
          if (ownProps.sensorUUID === '') {
            res([]);
          }
          fetch(`/api/sensor${ownProps.history.location.search}`)
            .then(response => response.json())
            .then((data) => {
              res(data);
            });
        });
      },
    };
  }),
)(Home);
