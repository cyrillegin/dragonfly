import {compose, mapProps} from 'recompose';
import AddSensor from './AddSensor';

export default compose(
  mapProps((ownProps) => {
    return {
      history: ownProps.history,
      getPlugins: () => {
        return new Promise((res, rej) => {
          if (ownProps.sensorUUID === '') {
            res([]);
          }
          fetch('/api/plugin')
            .then(response => response.json())
            .then((data) => {
              res(data);
            });
        });
      },
      testPlugin: (plugin, details) => {
        return new Promise((res, rej) => {
          fetch('/api/plugin', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({'plugin': plugin, 'details': details}),
          })
            .then(response => response.json())
            .then((data) => {
              res(data);
            });
        });
      },
      submitPlugin: (plugin, details) => {
        return new Promise((res, rej) => {
          const payload = {
            sensor: {
              poller: plugin,
              ...details,
            },
          };
          console.log(payload);

          fetch('/api/sensor', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          })
            .then(response => response.json())
            .then((data) => {
              res(data);
            });
        });
      },
    };
  }),
)(AddSensor);
