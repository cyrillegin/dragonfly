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

    ['start-date', 'end-date'].forEach(i =>
      document.getElementById(i).addEventListener('change', e => {
        updateUrl(i, e.target.value, () => {
          this.getGraphData();
        });
      }),
    );
  }

  getGraphData() {
    setTimeout(() => {
      // Convert path and hash to kwargs
      const url = `api/record${window.location.hash.replace('#', '?')}`;
      fetch(url)
        .then(res => res.json())
        .then(res => this.buildGraph(res));
    });
  }

  buildGraph(readings) {
    document.getElementById('graph-title').innerHTML = window.location.pathname.split('/')[1];
    if (window.location.hash.includes('compare')) {
      buildThree(readings);
    } else {
      buildD3(readings.readings);
    }
  }
}
