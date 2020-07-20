// Wait for final event on window resize
export default function() {
  return (() => {
    const timers = {};
    return (callback, ms, uniqueId) => {
      if (!uniqueId) uniqueId = 'x1x2x3x4';
      if (timers[uniqueId]) clearTimeout(timers[uniqueId]);
      timers[uniqueId] = setTimeout(callback, ms);
    };
  })();
}
