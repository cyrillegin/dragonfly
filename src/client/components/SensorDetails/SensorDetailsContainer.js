import {compose, mapProps} from 'recompose';
import SensorDetails from './SensorDetails';

export default compose(
  mapProps((ownProps) => {
    return {
      sensor: ownProps.sensor,
      updateSensor: (sensor) => {
        return new Promise((res, rej) => {
          fetch('/api/sensor', {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({...sensor}),
          })
            .then(response => response.json())
            .then((data) => {
              res({'data': 'data'});
            });
        });
      },
      deleteSensor: () => {
        return new Promise((res, rej) => {
          fetch('/api/sensor/?sensor=' + ownProps.sensor.uuid, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({...ownProps.sensor}),
          })
            .then(response => response.json())
            .then((data) => {
              ownProps.history.push('/');
              res({'data': data});
            });
        });
      },
    };
  }),
)(SensorDetails);
