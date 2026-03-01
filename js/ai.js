import { MATCH } from "./config.js";

export function updateAI(team, opponents, ball, difficulty, dt) {
  const cfg = difficulty;
  team.players.forEach((p, idx) => {
    if (p.isUser) return;
    p.cooldown = Math.max(0, p.cooldown - dt);
    const isKeeper = idx === 0;
    const target = chooseTarget(p, team, opponents, ball, isKeeper);
    moveToward(p, target.x, target.y, cfg.reaction, dt);

    const nearBall = Math.hypot(p.x - ball.x, p.y - ball.y) < p.r + 22;
    if (nearBall && p.cooldown <= 0) {
      const goalX = team.side === "left" ? MATCH.pitch.x + MATCH.pitch.w : MATCH.pitch.x;
      const distToGoal = Math.abs(goalX - p.x);
      if (distToGoal < 260 && Math.random() < cfg.shotBias) {
        const nx = (goalX - p.x) / distToGoal;
        ball.vx = nx * (420 + p.attrs.shotPower * 3.5);
        ball.vy = (Math.random() - 0.5) * 180;
        ball.vz = 120;
      } else if (Math.random() < cfg.passBias) {
        const mate = team.players[Math.floor(Math.random() * team.players.length)];
        const dx = mate.x - p.x, dy = mate.y - p.y;
        const d = Math.hypot(dx, dy) || 1;
        ball.vx = (dx / d) * (220 + p.attrs.passing * 2.5);
        ball.vy = (dy / d) * (220 + p.attrs.passing * 2.5);
      } else if (Math.random() < cfg.tackleBias) {
        const dx = goalX - p.x;
        ball.vx = (dx / (Math.abs(dx) || 1)) * 320;
      }
      p.cooldown = 0.7;
    }
  });
}

function chooseTarget(p, team, opponents, ball, isKeeper) {
  if (isKeeper) {
    return { x: team.side === "left" ? MATCH.pitch.x + 35 : MATCH.pitch.x + MATCH.pitch.w - 35, y: ball.y };
  }
  const zoneX = team.side === "left" ? MATCH.pitch.x + 260 : MATCH.pitch.x + MATCH.pitch.w - 260;
  const press = Math.hypot(ball.x - p.x, ball.y - p.y) < 250;
  if (press) return { x: ball.x, y: ball.y };

  const mark = opponents.players[(Math.floor(Math.random() * 3) + 1)];
  return { x: (zoneX + mark.x) / 2, y: (p.y + mark.y) / 2 };
}

function moveToward(p, tx, ty, reaction, dt) {
  const dx = tx - p.x, dy = ty - p.y;
  const d = Math.hypot(dx, dy) || 1;
  const maxSpd = 165 + p.attrs.speed * 2.8;
  const accel = (140 + p.attrs.acceleration * 2.2) * reaction;
  p.vx += (dx / d) * accel * dt;
  p.vy += (dy / d) * accel * dt;
  const sp = Math.hypot(p.vx, p.vy);
  if (sp > maxSpd) {
    p.vx = (p.vx / sp) * maxSpd;
    p.vy = (p.vy / sp) * maxSpd;
  }
}
