import React from 'react';
import ReactDOM from 'react-dom';
import App from './routes/App';

document.querySelector('.loader').parentElement.removeChild(document.querySelector('.loader'));

ReactDOM.render(
  <App />,
  document.getElementById('root'), // eslint-disable-line
);
