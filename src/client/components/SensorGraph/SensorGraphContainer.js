import {compose, mapProps} from 'recompose';
import SensorGraph from './SensorGraph';

export default compose(
  mapProps((ownProps) => {
    const search = ownProps.history.location.search;
    const start = search.indexOf('sensor=');
    let end = search.substring(start, search.length).indexOf('&');
    end = end > 0 ? end : search.length;
    const sensor = search.substring(start, end).split('=')[1];
    return {
      sensor: sensor || '',
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
