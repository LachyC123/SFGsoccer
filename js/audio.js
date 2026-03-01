const STUBS = ["kick", "tackle", "whistle", "crowd", "goal", "menu"];

export function createAudio(settings) {
  const enabled = settings.volume > 0;
  return {
    play(name) {
      if (!enabled || !STUBS.includes(name)) return;
      // Lightweight placeholder hook for easy replacement with real assets.
      // eslint-disable-next-line no-console
      console.debug(`[audio] ${name}`);
    },
  };
}
