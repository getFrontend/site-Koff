export const debounce = (func, msec) => {
  let lastCall = 0;
  let lastCallTimer = 0;

  return (...args) => {
    const previousCall = lastCall;
    lastCall = Date.now();

    if (previousCall && (lastCall - previousCall) <= msec) {
      clearTimeout(lastCallTimer);
    }

    lastCallTimer = setTimeout(() => func(...args), msec);
  }
}