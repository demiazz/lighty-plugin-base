import { plugin } from 'lighty';

import { endsWith } from './utils';


function pluginInitializer() {
  return function transform(component, node) {
    component.node = node;

    component.querySelector = function querySelector(selector) {
      return this.node.querySelector(selector);
    };

    component.querySelectorAll = function querySelectorAll(selector) {
      return this.node.querySelectorAll(selector);
    };

    const properties = Object.keys(component);

    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i];

      if (endsWith(property, 'on self')) {
        const events = property.slice(0, property.length - 8).split(', ');
        const handler = component[property];

        delete component[property];

        for (let j = 0; j < events.length; j += 1) {
          const event = events[j];

          component.node.addEventListener(event, handler.bind(component));
        }
      }
    }
  };
}


export default plugin('lighty-plugin-base', pluginInitializer);
