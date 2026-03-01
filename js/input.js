export function createInput() {
  const keys = new Set();
  window.addEventListener("keydown", (e) => keys.add(e.key.toLowerCase()));
  window.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));

  return {
    down: (key) => keys.has(key.toLowerCase()),
    axis() {
      return {
        x: (keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0),
        y: (keys.has("s") ? 1 : 0) - (keys.has("w") ? 1 : 0),
      };
    },
  };
}
