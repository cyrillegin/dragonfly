import {compose, mapProps} from 'recompose';
import queryString from 'query-string';
import SensorGraph from './SensorGraph';

export default compose(
  mapProps((ownProps) => {
    return {
      sensor: ownProps.sensor,
      submitTime: (startTime, endTime) => {
        const current = queryString.parse(location.search);
        if (startTime !== null) {
          current.start = startTime;
        }
        if (endTime !== null) {
          current.end = endTime;
        }
        ownProps.history.push({
          search: queryString.stringify(current),
        });
      },
      getReadings: () => {
        return new Promise((res, rej) => {
          fetch(`/api/reading${location.search}`)
            .then(response => response.json())
            .then((data) => {
              res(data);
            });
        });
      },
    };
  }),
)(SensorGraph);
