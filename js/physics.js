import { MATCH } from "./config.js";

const drag = 0.985;

export function updateBall(ball, dt, particles) {
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  ball.z = Math.max(0, ball.z + ball.vz * dt);
  ball.vz -= 460 * dt;
  ball.vx *= drag;
  ball.vy *= drag;

  const px = MATCH.pitch;
  if (ball.y < px.y + ball.r || ball.y > px.y + px.h - ball.r) {
    ball.vy *= -0.75;
    particles.push(burst(ball.x, clamp(ball.y, px.y + ball.r, px.y + px.h - ball.r), "#ffffff"));
    ball.y = clamp(ball.y, px.y + ball.r, px.y + px.h - ball.r);
  }

  const inGoalBand = ball.y > MATCH.height / 2 - MATCH.goalSize / 2 && ball.y < MATCH.height / 2 + MATCH.goalSize / 2;
  if (!inGoalBand && (ball.x < px.x + ball.r || ball.x > px.x + px.w - ball.r)) {
    ball.vx *= -0.8;
    ball.x = clamp(ball.x, px.x + ball.r, px.x + px.w - ball.r);
  }

  const speed = Math.hypot(ball.vx, ball.vy);
  if (speed > 600) {
    ball.trail.push({ x: ball.x, y: ball.y, life: 0.28 });
  }
  ball.trail.forEach((t) => (t.life -= dt));
  ball.trail = ball.trail.filter((t) => t.life > 0);
}

export function resolvePlayerMotion(p, dt) {
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.vx *= 0.93;
  p.vy *= 0.93;
  p.anim += dt * Math.hypot(p.vx, p.vy) * 0.03;
  const px = MATCH.pitch;
  p.x = clamp(p.x, px.x + p.r, px.x + px.w - p.r);
  p.y = clamp(p.y, px.y + p.r, px.y + px.h - p.r);
}

export function collidePlayers(teamA, teamB, shake) {
  const all = [...teamA.players, ...teamB.players];
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i], b = all[j];
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 0.001;
      const min = a.r + b.r - 2;
      if (d < min) {
        const push = (min - d) * 0.5;
        const nx = dx / d, ny = dy / d;
        a.x -= nx * push; a.y -= ny * push;
        b.x += nx * push; b.y += ny * push;
        a.vx -= nx * 25; a.vy -= ny * 25;
        b.vx += nx * 25; b.vy += ny * 25;
        shake(2);
      }
    }
  }
}

export function tryKick(p, ball, power, lift = 0) {
  const d = Math.hypot(ball.x - p.x, ball.y - p.y);
  if (d > p.r + 18) return false;
  const nx = (ball.x - p.x) / (d || 1);
  const ny = (ball.y - p.y) / (d || 1);
  ball.vx = nx * power;
  ball.vy = ny * power;
  ball.vz = lift;
  ball.ownerId = null;
  return true;
}

function burst(x, y, color) {
  return { x, y, color, ttl: 0.2, size: 12 };
}

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
