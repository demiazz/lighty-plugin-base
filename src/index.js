import { plugin } from 'lighty';

import { matches } from './utils';


let loadedEvent;

window.addEventListener('load', function handleWindowLoad(event) {
  loadedEvent = event;
});


function parseEventsDescriptor(descriptor) {
  const [eventsNames, selector] = descriptor.split(' on ');
  const events = eventsNames.split(', ');

  return { events, selector };
}


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

      const { events: eventsNames, selector } = parseEventsDescriptor(property);

      if (!selector) {
        continue; // eslint-disable-line
      }

      const handler = component[property];

      delete component[property];

      switch (selector) {
        case 'self':
          for (let j = 0; j < eventsNames.length; j += 1) {
            const eventName = eventsNames[j];

            component.node.addEventListener(eventName, handler.bind(component));
          }

          break;
        case 'self only':
          for (let j = 0; j < eventsNames.length; j += 1) {
            const eventName = eventsNames[j];

            component.node.addEventListener(eventName, (event) => {
              if (event.currentTarget !== event.target) {
                return;
              }

              handler.call(component, event);
            });
          }

          break;
        case 'body':
          for (let j = 0; j < eventsNames.length; j += 1) {
            const eventName = eventsNames[j];

            document.body.addEventListener(eventName, handler.bind(component));
          }

          break;
        case 'window':
          if (eventsNames.length === 1 && eventsNames[0] === 'load') {
            if (loadedEvent) {
              setTimeout(handler.bind(component, loadedEvent), 1);
            } else {
              window.addEventListener('load', handler.bind(component));
            }
          } else {
            for (let j = 0; j < eventsNames.length; j += 1) {
              const eventName = eventsNames[j];

              window.addEventListener(eventName, handler.bind(component));
            }
          }

          break;
        default:
          for (let j = 0; j < eventsNames.length; j += 1) {
            const eventName = eventsNames[j];

            component.node.addEventListener(eventName, (event) => {
              let currentNode = event.target;

              while (currentNode !== component.node) {
                if (matches(currentNode, selector)) {
                  handler.call(component, event);

                  return;
                }

                currentNode = currentNode.parentNode;
              }
            });
          }
      }
    }
  };
}


export default plugin('lighty-plugin-base', pluginInitializer);
