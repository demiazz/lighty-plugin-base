import { plugin } from 'lighty';


function pluginInitializer() {
  return function transform() { };
}


export default plugin('lighty-plugin-base', pluginInitializer);
