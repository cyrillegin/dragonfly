import html from './titlebar.html';
import './titlebar.scss';

export default class titlebar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;
    document.getElementById('dragonflyBtn').addEventListener('click', () => {
      window.history.pushState('home', 'home', '/');
      this.triggerEvent();
    });
    document.getElementById('documentationBtn').addEventListener('click', () => {
      window.history.pushState('docs', 'docs', '/documentation');
      this.triggerEvent();
    });
  }

  triggerEvent() {
    const event = new Event('urlChange');
    window.dispatchEvent(event);
  }
}
