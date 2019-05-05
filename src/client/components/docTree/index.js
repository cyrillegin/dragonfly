import html from './docTree.html'; // eslint-disable-line
import './docTree.scss';

const showdown = require('showdown');

export default class docTree extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;
    this.converter = new showdown.Converter();

    document.getElementById('temperature').addEventListener('click', () => {
      window.history.pushState('docs', 'docs', '/documentation/DS18B20');
      this.getMD();
    });

    window.addEventListener('urlChange', e => {
      this.getMD();
    });

    this.getMD();
  }
  getMD() {
    setTimeout(() => {
      let url = window.location.pathname.replace('/documentation', '');
      if (url.startsWith('/')) {
        url = url.substring(1, url.length);
      }
      if (url.length === 0) {
        url = '/docs/readme';
      } else {
        url = `/docs/${url}`;
      }
      fetch(url).then(res => {
        const elem = document.getElementById('content');
        res.text().then(txt => {
          elem.innerHTML = this.converter.makeHtml(txt);
        });
      });
    });
  }
}
