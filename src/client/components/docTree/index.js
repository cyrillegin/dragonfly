import { updateUrl } from '../utility';
import html from './docTree.html';
import './docTree.scss';

export default class docTree extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;

    document.getElementById('temp').addEventListener('click', () => {
      updateUrl('sensor', 'temp');
    });
  }
}
