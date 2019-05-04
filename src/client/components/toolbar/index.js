import html from './toolbar.html';
import './toolbar.scss';

export default class toolbar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;
    this.modal = document.getElementById('modal');

    // Listeners
    document.getElementById('upload-button').addEventListener('click', () => {
      this.modal.setAttribute('open', true);
    });
  }
}
