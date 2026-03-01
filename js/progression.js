import { ATTRIBUTES } from "./config.js";

export function newPlayerProfile(name = "Captain") {
  const attrs = Object.fromEntries(ATTRIBUTES.map((a) => [a, 55]));
  return { name, level: 1, xp: 0, points: 0, attrs, shirt: 10, look: { skin: "#f2c9a1", hair: "spike", hairColor: "#2a1c14", boots: "#ffbe0b", accessory: "#5efaff" } };
}

export function overall(attrs) {
  const vals = Object.values(attrs);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function applyMatchXp(player, performance = {}) {
  const gain = 45 + (performance.goals || 0) * 20 + (performance.assists || 0) * 12 + (performance.tackles || 0) * 4 + (performance.win ? 20 : 0);
  player.xp += gain;
  while (player.xp >= xpToLevel(player.level)) {
    player.xp -= xpToLevel(player.level);
    player.level += 1;
    player.points += 3;
  }
  return gain;
}

export function xpToLevel(level) {
  return 110 + level * 45;
}

export function spendPoint(player, attr) {
  if (player.points <= 0 || !player.attrs[attr]) return false;
  if (player.attrs[attr] >= 99) return false;
  player.attrs[attr] += 1;
  player.points -= 1;
  return true;
}
