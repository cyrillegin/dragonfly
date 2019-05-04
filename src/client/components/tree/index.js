import { updateUrl } from '../utility';
import html from './tree.html';
import './tree.scss';

export default class tree extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;

    // Get list of types enterend in the database so far.
    fetch('/api/record')
      .then(res => res.json())
      .then(res => {
        const root = document.getElementById('tree-root');
        // Setup element
        root.innerHTML = res
          .map(
            elem =>
              `<div class="tree-item" id=${elem}> 
                ${elem} <button id="${elem}-compare">Compare</button>
              </div>`,
          )
          .join('');
        // Setup button listeners
        res.forEach(elem =>
          document.getElementById(`${elem}-compare`).addEventListener('click', e => {
            event.stopImmediatePropagation();
            updateUrl('compare', elem);
          }),
        );
        // Add click events to elements
        res.forEach(elem => {
          document.getElementById(elem).addEventListener('click', () => {
            updateUrl('type', elem);
          });
        });
      });
  }
}
