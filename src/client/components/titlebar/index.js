import html from './titlebar.html';
import './titlebar.scss';

export default class titlebar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;
  }
}
