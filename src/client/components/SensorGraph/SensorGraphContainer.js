import {compose, mapProps} from 'recompose';
import SensorGraph from './SensorGraph';

export default compose(
  mapProps((ownProps) => {

    return {
      sensor: ownProps.sensor,
      getReadings: () => {
        return new Promise((res, rej) => {
          fetch(`/api/reading${ownProps.history.location.search}`)
            .then(response => response.json())
            .then((data) => {
              res(data);
            });
        });
      },
    };
  }),
)(SensorGraph);
