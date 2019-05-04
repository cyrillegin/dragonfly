import titlebar from './titlebar';
import toolbar from './toolbar';
import tree from './tree';
import graph from './graph';
import modal from './modal';

export function defineComponents() {
  window.customElements.define('titlebar-component', titlebar);
  window.customElements.define('toolbar-component', toolbar);
  window.customElements.define('tree-component', tree);
  window.customElements.define('graph-component', graph);
  window.customElements.define('modal-component', modal);
  console.log('hello');
}
