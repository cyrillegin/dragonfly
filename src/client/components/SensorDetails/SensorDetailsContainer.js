import { compose, mapProps } from 'recompose';
import withSnackbar from '../../hoc/withSnackbar';
import SensorDetails from './SensorDetails';

export default compose(
  withSnackbar,
  mapProps(ownProps => {
    return {
      ...ownProps,
      updateSensor: sensor => {
        return new Promise((res, rej) => {
          fetch('/api/sensor', {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...sensor }),
          })
            .then(response => response.json())
            .then(data => {
              res({ data });
            });
        });
      },
      deleteSensor: () => {
        return new Promise((res, rej) => {
          fetch('/api/sensor/?sensor=' + ownProps.sensor.uuid, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...ownProps.sensor }),
          })
            .then(response => response.json())
            .then(data => {
              res(data);
              window.location.reload();
            });
        });
      },
      addEntry: value => {
        return fetch('/api/reading', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uuid: ownProps.sensor.uuid,
            value: value,
            sensor: ownProps.sensor.name,
          }),
        });
      },
    };
  }),
)(SensorDetails);
