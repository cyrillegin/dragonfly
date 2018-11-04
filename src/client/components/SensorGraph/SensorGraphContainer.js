import { compose, mapProps } from 'recompose';
import queryString from 'query-string';
import SensorGraph from './SensorGraph';

export default compose(
  mapProps(ownProps => {
    const current = queryString.parse(location.search);
    const currentStartTime = current.start ? parseInt(current.start) : null;
    const currentEndTime = current.end ? parseInt(current.end) : null;
    return {
      sensor: ownProps.sensor,
      currentStartTime,
      currentEndTime,
      submitTime: (startTime, endTime) => {
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
            .then(data => {
              res(data);
            });
        });
      },
    };
  }),
)(SensorGraph);
