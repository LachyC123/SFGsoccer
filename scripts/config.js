window.CONFIG = {
  game: {
    width: 360,
    height: 640,
    scoreLimit: 18,
    matchTime: 180,
    respawnTime: 2.6,
    botCountPerTeam: 3,
    vfxScale: 1
  },
  arena: {
    width: 1200,
    height: 1600,
    walls: [
      { x: 600, y: 800, w: 260, h: 90 },
      { x: 360, y: 520, w: 120, h: 300 },
      { x: 840, y: 1080, w: 120, h: 300 },
      { x: 250, y: 1000, w: 140, h: 160 },
      { x: 950, y: 600, w: 140, h: 160 }
    ],
    spawns: {
      blue: { x: 210, y: 800 },
      red: { x: 990, y: 800 }
    }
  },
  controls: {
    stickRadius: 46,
    deadzone: 0.12
  },
  bot: {
    aggression: 0.76,
    retreatHealth: 0.28,
    retargetTime: 0.45
  },
  progression: {
    baseCoins: 65,
    baseXp: 38
  }
};
