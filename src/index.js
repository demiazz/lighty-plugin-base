import { plugin } from 'lighty';


function pluginInitializer() {
  return function transform(component, node) {
    component.node = node;

    component.querySelector = function querySelector(selector) {
      return this.node.querySelector(selector);
    };

    component.querySelectorAll = function querySelectorAll(selector) {
      return this.node.querySelectorAll(selector);
    };
  };
}


export default plugin('lighty-plugin-base', pluginInitializer);
