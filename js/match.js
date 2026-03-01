import { DIFFICULTIES, MATCH } from "./config.js";
import { makeBall, makeTeam } from "./entities.js";
import { collidePlayers, resolvePlayerMotion, tryKick, updateBall } from "./physics.js";
import { updateAI } from "./ai.js";

export function createMatch(opts) {
  const left = makeTeam("left", opts.homeTeam, opts.playerProfile);
  const right = makeTeam("right", opts.awayTeam);
  left.players[2].isUser = true;
  left.players[2].look = { ...opts.playerProfile.look };
  left.players[2].shirt = opts.playerProfile.shirt;
  left.players[2].displayName = opts.playerProfile.name;

  return {
    mode: "match",
    left,
    right,
    ball: makeBall(),
    difficulty: DIFFICULTIES[opts.difficulty],
    halfLength: opts.length,
    time: opts.length,
    running: true,
    kickoffClock: MATCH.kickoffBuffer,
    particles: [],
    shake: 0,
    events: [],
    result: null,
  };
}

export function updateMatch(ctx, input, audio, dt) {
  if (!ctx.running) return;
  if (ctx.kickoffClock > 0) {
    ctx.kickoffClock -= dt;
    return;
  }
  ctx.time -= dt;
  if (ctx.time <= 0) {
    ctx.running = false;
    ctx.result = { left: ctx.left.score, right: ctx.right.score, winner: ctx.left.score === ctx.right.score ? "Draw" : ctx.left.score > ctx.right.score ? ctx.left.name : ctx.right.name };
    audio.play("whistle");
    return;
  }

  const user = ctx.left.players.find((p) => p.isUser);
  controlUser(user, input, ctx.ball, audio, dt);

  updateAI(ctx.left, ctx.right, ctx.ball, ctx.difficulty, dt);
  updateAI(ctx.right, ctx.left, ctx.ball, ctx.difficulty, dt);

  for (const p of [...ctx.left.players, ...ctx.right.players]) {
    resolvePlayerMotion(p, dt);
    stealBall(p, ctx.ball);
  }
  collidePlayers(ctx.left, ctx.right, (v) => (ctx.shake = Math.max(ctx.shake, v)));
  updateBall(ctx.ball, dt, ctx.particles);

  goalCheck(ctx, audio);
  ctx.particles.forEach((p) => (p.ttl -= dt));
  ctx.particles = ctx.particles.filter((p) => p.ttl > 0);
  ctx.shake = Math.max(0, ctx.shake - 12 * dt);
}

function controlUser(p, input, ball, audio, dt) {
  const ax = input.axis();
  const sprint = input.down("shift");
  const speed = 245 + p.attrs.speed * 4.1 + (sprint ? 155 : 0);
  const accel = 320 + p.attrs.acceleration * 3.6;
  const d = Math.hypot(ax.x, ax.y) || 1;
  if (ax.x || ax.y) {
    p.vx += (ax.x / d) * accel * dt;
    p.vy += (ax.y / d) * accel * dt;
  }
  const sp = Math.hypot(p.vx, p.vy);
  if (sp > speed) {
    p.vx = (p.vx / sp) * speed;
    p.vy = (p.vy / sp) * speed;
  }

  p.cooldown = Math.max(0, p.cooldown - dt);
  if (input.down("j") && p.cooldown === 0) {
    if (tryKick(p, ball, 280 + p.attrs.passing * 3.2, 60)) audio.play("kick");
    p.cooldown = 0.3;
  }
  if (input.down("k") && p.cooldown === 0) {
    if (tryKick(p, ball, 390 + p.attrs.shotPower * 4.3, 130)) audio.play("kick");
    p.cooldown = 0.4;
  }
  if (input.down("l") && p.cooldown === 0) {
    const dBall = Math.hypot(ball.x - p.x, ball.y - p.y);
    if (dBall < 42) {
      ball.vx += (ball.x - p.x) * 18;
      ball.vy += (ball.y - p.y) * 18;
    }
    p.vx *= 1.8;
    p.vy *= 1.8;
    p.cooldown = 0.55;
    audio.play("tackle");
  }
}

function stealBall(p, ball) {
  const d = Math.hypot(ball.x - p.x, ball.y - p.y);
  if (d < p.r + 10 && ball.z < 25) {
    ball.vx += p.vx * 0.18;
    ball.vy += p.vy * 0.18;
  }
}

function goalCheck(ctx, audio) {
  const yMin = MATCH.height / 2 - MATCH.goalSize / 2;
  const yMax = MATCH.height / 2 + MATCH.goalSize / 2;
  const inBand = ctx.ball.y >= yMin && ctx.ball.y <= yMax;
  if (!inBand) return;

  if (ctx.ball.x < MATCH.pitch.x - 5) {
    ctx.right.score++;
    ctx.events.push({ type: "goal", side: "right", at: ctx.time });
    resetKickoff(ctx);
    audio.play("goal");
  }
  if (ctx.ball.x > MATCH.pitch.x + MATCH.pitch.w + 5) {
    ctx.left.score++;
    ctx.events.push({ type: "goal", side: "left", at: ctx.time });
    resetKickoff(ctx);
    audio.play("goal");
  }
}

function resetKickoff(ctx) {
  ctx.ball.x = MATCH.width / 2;
  ctx.ball.y = MATCH.height / 2;
  ctx.ball.vx = 0; ctx.ball.vy = 0; ctx.ball.vz = 0;
  [...ctx.left.players, ...ctx.right.players].forEach((p, i) => {
    p.x = (p.id.includes(ctx.left.id) ? MATCH.pitch.x + 200 : MATCH.pitch.x + MATCH.pitch.w - 200) + ((i % 5) - 2) * 28;
    p.y = MATCH.height / 2 + ((i % 5) - 2) * 95;
    p.vx = 0; p.vy = 0;
  });
  ctx.kickoffClock = MATCH.kickoffBuffer;
  ctx.shake = 12;
}
