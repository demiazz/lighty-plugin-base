function endsWithNative(string, substring) {
  return string.endsWith(substring);
}

function endsWithPolyfill(string, substring) {
  return string.substr(-substring.length) === substring;
}

export const endsWith = String.prototype.endsWith
  ? endsWithNative
  : endsWithPolyfill;
