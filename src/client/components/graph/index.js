import { updateUrl } from '../utility';
import html from './graph.html';
import './graph.scss';
import buildD3 from './d3';

export default class graph extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;
    window.addEventListener('urlChange', e => {
      this.getGraphData();
    });
    this.getGraphData();

    ['start-date', 'end-date'].forEach(i => {
      const elem = document.getElementById(i);
      elem.addEventListener('change', e => {
        updateUrl(i, e.target.value, () => {
          this.getGraphData();
        });
      });
      // elem.valueAsDate = locaation.includes(i) new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
    });
  }

  getGraphData() {
    if (window.location.hash.length < 5) {
      return;
    }
    setTimeout(() => {
      fetch(`api/reading${window.location.hash.replace('#', '?')}`)
        .then(res => res.json())
        .then(res => this.buildGraph(res));

      fetch(`api/sensor${window.location.hash.replace('#', '?')}`)
        .then(res => res.json())
        .then(res => {
          console.log(res);
          document.getElementById('graph-title').innerHTML = res.name;
        });
    });
  }

  buildGraph(readings) {
    // Get dates or set defaults
    const queryObject = {};
    window.location.hash
      .replace('#', '')
      .split('&')
      .forEach(e => {
        queryObject[e.split('=')[0]] = e.split('=')[1];
      });
    if ('start-date' in queryObject) {
      document.getElementById('start-date').valueAsDate = new Date(queryObject['start-date']);
    } else {
      queryObject['start-date'] = new Date((new Date() - 1000 * 60 * 60 * 24).getTime());
    }
    if ('end-date' in queryObject) {
      document.getElementById('end-date').valueAsDate = new Date(queryObject['end-date']);
    } else {
      queryObject['end-date'] = new Date();
    }

    // Build graph
    buildD3(readings, queryObject['start-date'], queryObject['end-date']);
  }
}
