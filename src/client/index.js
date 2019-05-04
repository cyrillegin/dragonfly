import { defineComponents } from './components';
import app from './app.html';
import './globals.scss';

(() => {
  defineComponents();

  document.getElementById('root').innerHTML = app;

  window.onhashchange = () => {
    const event = new Event('urlChange');
    window.dispatchEvent(event);
  };
})();
