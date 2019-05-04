import html from './modal.html';
import './modal.scss';

export default class modal extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;
    this.dropzone = document.getElementById('dropzone');
    this.open = false;
    this.classList.add('closed');
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (newVal === 'true') {
      this.setupModal();
    }
  }

  setupModal() {
    this.classList.remove('closed');
    // Listeners
    // Close modal if background is clicked
    document.getElementById('modal').addEventListener('click', e => {
      this.tearDownModal();
    });
    // prevnet clicks on the modal from closing the modal
    document.getElementById('modal-content').addEventListener('click', e => {
      this.preventDefaults(e);
    });

    // close modal
    document.getElementById('close-modal-button').addEventListener('click', e => {
      this.preventDefaults(e);
      this.tearDownModal();
    });

    // Trigger upload
    document.getElementById('modal-upload-button').addEventListener('click', e => {
      this.preventDefaults(e);

      const form = new FormData();
      form.append('myfile', this.files[0], this.files[0].name);

      fetch('/api/file', {
        method: 'POST',
        body: form,
      }).then(res => {
        console.log('got a response');
        console.log(res);
      });
    });

    // Drop zone events
    this.dropzone.addEventListener('drop', e => {
      this.files = e.dataTransfer.files;
      this.preventDefaults(e);
    });
    this.dropzone.addEventListener('dragover', e => {
      this.preventDefaults(e);
      this.dropzone.classList.add('dropzone-over');
    });
    this.dropzone.addEventListener('dragleave', e => {
      this.preventDefaults(e);
      this.dropzone.classList.remove('dropzone-over');
    });
  }

  tearDownModal() {
    // ['drop', 'dragover', 'dragleave'].forEach(event => {
    //   this.dropzone.removeEventListener(event, );
    // });
    this.classList.add('closed');
  }

  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
}
