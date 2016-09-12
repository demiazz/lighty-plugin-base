import { plugin } from 'lighty';


function pluginInitializer() {
  return function transform(component, node) {
    component.node = node;
  };
}


export default plugin('lighty-plugin-base', pluginInitializer);
