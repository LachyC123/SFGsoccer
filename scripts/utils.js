window.Utils = {
  clamp(v, min, max) { return Math.max(min, Math.min(max, v)); },
  lerp(a, b, t) { return a + (b - a) * t; },
  dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); },
  norm(x, y) {
    const m = Math.hypot(x, y) || 1;
    return { x: x / m, y: y / m, m };
  },
  rand(min, max) { return min + Math.random() * (max - min); },
  easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); },
  fmtTime(sec) {
    const s = Math.max(0, Math.floor(sec));
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }
};
