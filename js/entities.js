import { MATCH } from "./config.js";

export function makeBall() {
  return { x: MATCH.width / 2, y: MATCH.height / 2, z: 0, vx: 0, vy: 0, vz: 0, r: 9, ownerId: null, trail: [] };
}

export function makeTeam(side, teamDef, captainProfile) {
  const dir = side === "left" ? 1 : -1;
  const baseX = side === "left" ? MATCH.pitch.x + 170 : MATCH.pitch.x + MATCH.pitch.w - 170;
  const ids = ["GK", "D1", "M1", "M2", "F1"];
  return {
    side,
    dir,
    id: teamDef.id,
    name: teamDef.name,
    short: teamDef.short,
    colors: { primary: teamDef.primary, secondary: teamDef.secondary, accent: teamDef.accent },
    score: 0,
    players: ids.map((pid, i) => ({
      id: `${teamDef.id}_${pid}`,
      role: pid,
      x: baseX + (side === "left" ? i * 25 : -i * 25),
      y: MATCH.height / 2 + (i - 2) * 90,
      vx: 0,
      vy: 0,
      r: 16,
      fatigue: 1,
      hasBall: false,
      attrs: i === 2 && captainProfile ? captainProfile.attrs : randomAttrs(),
      isUser: false,
      cooldown: 0,
      anim: 0,
      stats: { goals: 0, assists: 0, tackles: 0 },
    })),
  };
}

function randomAttrs() {
  return {
    speed: 45 + Math.random() * 35,
    acceleration: 45 + Math.random() * 30,
    strength: 45 + Math.random() * 35,
    shotPower: 45 + Math.random() * 35,
    shotAccuracy: 45 + Math.random() * 35,
    passing: 45 + Math.random() * 35,
    ballControl: 45 + Math.random() * 35,
    tackling: 45 + Math.random() * 35,
    stamina: 55 + Math.random() * 35,
    aerial: 45 + Math.random() * 35,
    curve: 45 + Math.random() * 35,
    reactions: 45 + Math.random() * 35,
    aggression: 45 + Math.random() * 35,
  };
}
