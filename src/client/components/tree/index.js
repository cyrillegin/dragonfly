import { updateUrl } from '../utility';
import html from './tree.html';
import './tree.scss';

export default class tree extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;

    // Get list of types entered in the database so far.
    fetch('/api/station')
      .then(res => res.json())
      .then(res => {
        const root = document.getElementById('tree-root');
        // Setup element
        root.innerHTML = res
          .map(
            elem =>
              `<div class="tree-item" id=${elem._id}> 
                ${elem.station.name}-${elem.name}
              </div>`,
          )
          .join('');
        // Add click events to elements
        res.forEach(elem => {
          document.getElementById(elem._id).addEventListener('click', () => {
            updateUrl('sensor', elem._id);
          });
        });
      });
  }
}
