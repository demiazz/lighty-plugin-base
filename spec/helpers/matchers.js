function toBeInstanceOf() {
  return {
    compare(actual, klass) {
      const result = {
        pass: actual instanceof klass,
      };

      result.message = result.pass
        ? `Expected object not to be an instance of ${klass.name}`
        : `Expected object to be an instance of ${klass.name}`;

      return result;
    },
  };
}

function toHaveBeenCalledOn() {
  return {
    compare(actual, context) {
      const result = {
        pass: actual.calls.all().every(c => c.object === context),
      };

      result.message = result.pass
        ? 'Expected function not to be called on given context'
        : 'Expected function to be called on given context';

      return result;
    },
  };
}


export default {
  toBeInstanceOf,
  toHaveBeenCalledOn,
};
