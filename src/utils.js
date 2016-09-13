function getMatchesFn() {
  const e = document.documentElement;

  return (
    e.matches ||
    e.matchesSelector ||
    e.msMatchesSelector ||
    e.mozMatchesSelector ||
    e.webkitMatchesSelector ||
    e.oMatchesSelector
  );
}

const matchesFn = getMatchesFn();

export function matches(element, selector) {
  return matchesFn.call(element, selector);
}
