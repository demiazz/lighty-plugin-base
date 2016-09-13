import { plugin } from 'lighty';

import { endsWith } from './utils';


let loadedEvent;

window.addEventListener('load', function handleWindowLoad(event) {
  loadedEvent = event;
});


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

      if (endsWith(property, 'on self only')) {
        const events = property.slice(0, property.length - 13).split(', ');
        const handler = component[property];

        delete component[property];

        for (let j = 0; j < events.length; j += 1) {
          const event = events[j];

          component.node.addEventListener(event, (e) => {
            if (e.currentTarget !== e.target) {
              return;
            }

            handler.call(component, e);
          });
        }
      }

      if (endsWith(property, 'on body')) {
        const events = property.slice(0, property.length - 8).split(', ');
        const handler = component[property];

        delete component[property];

        for (let j = 0; j < events.length; j += 1) {
          const event = events[j];

          document.body.addEventListener(event, handler.bind(component));
        }
      }

      if (property === 'load on window') {
        const handler = component[property];

        delete component[property];

        if (loadedEvent) {
          setTimeout(handler.bind(component, loadedEvent), 1);
        } else {
          window.addEventListener('load', handler.bind(component));
        }
      } else if (endsWith(property, 'on window')) {
        const events = property.slice(0, property.length - 10).split(', ');
        const handler = component[property];

        delete component[property];

        for (let j = 0; j < events.length; j += 1) {
          const event = events[j];

          window.addEventListener(event, handler.bind(component));
        }
      }
    }
  };
}


export default plugin('lighty-plugin-base', pluginInitializer);
