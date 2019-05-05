import { defineComponents } from './components';
import app from './app.html';
import documentation from './documentation.html';
import './globals.scss';

(() => {
  defineComponents();

  function setupRouting() {
    switch (window.location.pathname) {
      case '/documentation':
        document.getElementById('root').innerHTML = documentation;
        break;
      default:
        document.getElementById('root').innerHTML = app;
    }
  }

  setupRouting();

  window.onhashchange = () => {
    const event = new Event('urlChange');
    window.dispatchEvent(event);
  };

  window.addEventListener('urlChange', () => {
    setupRouting();
  });
})();
