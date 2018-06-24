import {compose, mapProps} from 'recompose';
import SensorActions from './SensorActions';

export default compose(
  mapProps((ownProps) => {
    return {
      sensor: ownProps.sensor,
      getActions: () => {
        return new Promise((res, rej) => {
          fetch(`/api/action${location.search}`)
            .then(response => response.json())
            .then((data) => {
              res(data);
            });
        });
      },
      addAction: (info) => {
        return new Promise((res, rej) => {
          fetch('/api/action', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({...info}),
          })
            .then(response => response.json())
            .then((data) => {
              console.log(data);
              res({'data': data});
            });
        });
      },
      updateAction: (info) => {
        return new Promise((res, rej) => {
          fetch('/api/action', {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({...info}),
          })
            .then(response => response.json())
            .then((data) => {
              res({'data': data});
              window.location.reload();
            });
        });
      },
      deleteAction: (info) => {
        console.log(info);
        return new Promise((res, rej) => {
          fetch('/api/action/?action=' + info.action, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({...info}),
          })
            .then(response => response.json())
            .then((data) => {
              res({'data': data});
              window.location.reload();
            });
        });
      },
    };
  }),
)(SensorActions);
