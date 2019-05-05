import { defineComponents } from './components';
import app from './app.html';
import documentation from './documentation.html';
import './globals.scss';

(() => {
  console.log('go');
  defineComponents();

  function setupRouting() {
    if (window.location.pathname.startsWith('/documentation')) {
      document.getElementById('root').innerHTML = documentation;
    } else {
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
