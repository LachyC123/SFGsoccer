import { MATCH } from "./js/config.js";
import { applyPlayerLook, applyTeamCustomization } from "./js/customization.js";
import { createInput } from "./js/input.js";
import { recordResult, seasonFinished } from "./js/leagues.js";
import { createMatch, updateMatch } from "./js/match.js";
import { applyMatchXp } from "./js/progression.js";
import { createAudio } from "./js/audio.js";
import { createState } from "./js/state.js";
import {
  careerPanel,
  matchEndPanel,
  playerPanel,
  quickMatchPanel,
  renderHUD,
  spendPoint,
  staticPanel,
  teamCustomizationPanel,
  wireMenu,
} from "./js/ui.js";

const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const hud = document.querySelector("#hud");
const overlay = document.querySelector("#screenOverlay");
const state = createState();
const input = createInput();
const audio = createAudio(state.data.settings);

let last = performance.now();
let showGoalFlash = 0;

function loop(ts) {
  const dt = Math.min(0.033, (ts - last) / 1000);
  last = ts;

  if (state.data.match) {
    updateMatch(state.data.match, input, audio, dt);
    const scored = state.data.match.events.at(-1);
    if (scored && ts - (scored.ts || 0) < 16) {
      showGoalFlash = 0.35;
    }
    renderMatch(state.data.match, dt);
    renderHUD(hud, state.data.match);

    if (!state.data.match.running && state.data.match.result) {
      const done = state.data.match;
      state.data.lastMatch = done.result;
      state.data.match = null;
      endMatch(done);
    }
  } else {
    renderBackground();
    renderHUD(hud, null);
  }

  showGoalFlash = Math.max(0, showGoalFlash - dt);
  requestAnimationFrame(loop);
}

function renderBackground() {
  ctx.fillStyle = "#2ca24b";
  ctx.fillRect(0, 0, MATCH.width, MATCH.height);
  drawPitch();
}

function renderMatch(m, dt) {
  const shake = state.data.settings.cameraShake ? m.shake : 0;
  ctx.save();
  ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  renderBackground();

  m.ball.trail.forEach((t) => {
    ctx.globalAlpha = t.life * 2;
    ctx.fillStyle = "#fff59e";
    ctx.beginPath();
    ctx.arc(t.x, t.y, 6 * t.life * 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  drawTeam(m.left);
  drawTeam(m.right);

  m.particles.forEach((p) => {
    ctx.globalAlpha = p.ttl * 5;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size * 0.4, p.y - p.size * 0.4, p.size, p.size);
  });
  ctx.globalAlpha = 1;

  drawBall(m.ball);
  ctx.restore();

  if (showGoalFlash > 0 && !document.querySelector(".goal-flash")) {
    const flash = document.createElement("div");
    flash.className = "goal-flash";
    document.querySelector("#app").append(flash);
    setTimeout(() => flash.remove(), 440);
  }
}

function drawPitch() {
  const p = MATCH.pitch;
  ctx.fillStyle = "#40b35a";
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 4;
  ctx.strokeRect(p.x, p.y, p.w, p.h);
  ctx.beginPath();
  ctx.moveTo(MATCH.width / 2, p.y);
  ctx.lineTo(MATCH.width / 2, p.y + p.h);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(MATCH.width / 2, MATCH.height / 2, 90, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#1b2540";
  ctx.fillRect(p.x - 24, MATCH.height / 2 - MATCH.goalSize / 2, 24, MATCH.goalSize);
  ctx.fillRect(p.x + p.w, MATCH.height / 2 - MATCH.goalSize / 2, 24, MATCH.goalSize);
}

function drawTeam(team) {
  for (const p of team.players) {
    const bob = Math.sin(p.anim) * 1.8;
    const stride = Math.sin(p.anim * 1.6) * 3;
    const look = p.look || { skin: "#e2b88c", hair: "short", hairColor: "#2f2018", boots: "#111" };

    ctx.globalAlpha = 0.28;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 15, 11, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = team.colors.primary;
    ctx.fillRect(p.x - 7, p.y - 11 + bob, 14, 18);
    ctx.fillStyle = team.colors.secondary;
    ctx.fillRect(p.x - 4, p.y - 11 + bob, 8, 18);

    ctx.strokeStyle = team.colors.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p.x - 7, p.y - 2 + bob);
    ctx.lineTo(p.x + 7, p.y - 2 + bob);
    ctx.stroke();

    ctx.fillStyle = look.skin;
    ctx.beginPath();
    ctx.arc(p.x, p.y - 16 + bob, 6.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = look.hairColor || "#2f2018";
    if ((look.hair || "short") === "mohawk") {
      ctx.fillRect(p.x - 1.5, p.y - 24 + bob, 3, 8);
    } else if ((look.hair || "short") === "spike") {
      ctx.beginPath();
      ctx.moveTo(p.x - 6, p.y - 19 + bob);
      ctx.lineTo(p.x, p.y - 26 + bob);
      ctx.lineTo(p.x + 6, p.y - 19 + bob);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y - 19 + bob, 6.5, Math.PI, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = look.skin;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(p.x - 7, p.y - 8 + bob);
    ctx.lineTo(p.x - 11, p.y - 2 + bob + stride * 0.35);
    ctx.moveTo(p.x + 7, p.y - 8 + bob);
    ctx.lineTo(p.x + 11, p.y - 2 + bob - stride * 0.35);
    ctx.stroke();

    ctx.strokeStyle = look.boots || "#111";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p.x - 4, p.y + 7 + bob);
    ctx.lineTo(p.x - 4, p.y + 13 + bob + stride);
    ctx.moveTo(p.x + 4, p.y + 7 + bob);
    ctx.lineTo(p.x + 4, p.y + 13 + bob - stride);
    ctx.stroke();

    if (Number.isFinite(p.shirt)) {
      ctx.fillStyle = "#fff";
      ctx.font = "bold 8px Orbitron, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(p.shirt), p.x, p.y + 1 + bob);
    }

    if (p.isUser) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(p.x - 10, p.y - 33, 20, 5);
    }
  }
}

function drawBall(ball) {
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y - ball.z * 0.2, ball.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function openMenu() {
  state.data.screen = "menu";
  wireMenu(state.data, overlay, {
    quick: openQuick,
    career: openCareer,
    training: startTraining,
    team: openTeamCustomization,
    player: openPlayer,
    how: () => staticPanel(overlay, "How to Play", `<p>WASD move • Shift sprint • J pass/lob • K shoot • L tackle/special.</p><p>Win matches, gain XP, level up your captain, and climb four divisions.</p>`, openMenu),
    settings: () => staticPanel(overlay, "Settings", `<p>Volume: ${state.data.settings.volume}</p><p>Camera Shake: ${state.data.settings.cameraShake ? "On" : "Off"}</p><p>Saves automatically in localStorage.</p>`, openMenu),
    credits: () => staticPanel(overlay, "Credits", `<p>Designed and coded as an original arcade football browser game concept.</p>`, openMenu),
  });
}

function openQuick() {
  quickMatchPanel(state.data, overlay, (opts) => {
    if (opts.home === opts.away) return;
    startMatch(opts.home, opts.away, opts.difficulty, opts.length, false);
  }, openMenu);
}

function openCareer() {
  careerPanel(state.data, overlay, {
    play: () => {
      const c = state.data.career;
      const div = c.divisions[c.currentLeague];
      const fix = div.fixtures.find((f) => !f.played && (f.home === c.clubId || f.away === c.clubId));
      if (!fix) return;
      startMatch(fix.home, fix.away, "Normal", 180, true);
    },
    sim: () => {
      simulateRound();
      openCareer();
    },
    back: openMenu,
  });
}

function startTraining() {
  startMatch(state.data.selectedTeamId, state.data.teams.find((t) => t.id !== state.data.selectedTeamId).id, "Easy", 600, false);
}

function openTeamCustomization() {
  teamCustomizationPanel(state.data, overlay, (form) => {
    const t = state.data.teams.find((x) => x.id === state.data.selectedTeamId);
    applyTeamCustomization(t, form);
    state.save();
    openTeamCustomization();
  }, openMenu);
}

function openPlayer() {
  playerPanel(state.data, overlay, (attr) => {
    spendPoint(state.data.playerProfile, attr);
    state.save();
    openPlayer();
  }, (form) => {
    applyPlayerLook(state.data.playerProfile, form);
    state.save();
    openPlayer();
  }, openMenu);
}

function startMatch(homeId, awayId, difficulty, length, isCareer) {
  const homeTeam = state.data.teams.find((t) => t.id === homeId);
  const awayTeam = state.data.teams.find((t) => t.id === awayId);
  state.data.screen = "match";
  overlay.innerHTML = "";
  state.data.match = createMatch({ homeTeam, awayTeam, difficulty, length, playerProfile: state.data.playerProfile });
  state.data.match.isCareer = isCareer;
}

function endMatch(matchState) {
  const perf = {
    goals: matchState.left.players.find((p) => p.isUser)?.stats.goals || 0,
    assists: 0,
    tackles: matchState.left.players.find((p) => p.isUser)?.stats.tackles || 0,
    win: matchState.left.score > matchState.right.score,
  };
  applyMatchXp(state.data.playerProfile, perf);

  if (matchState.isCareer) {
    const c = state.data.career;
    const div = c.divisions[c.currentLeague];
    recordResult(div, matchState.left.id, matchState.right.id, matchState.left.score, matchState.right.score);
    c.budget += 100 + matchState.left.score * 30;
    c.fans += matchState.left.score * 55 + (matchState.left.score > matchState.right.score ? 200 : 40);
    if (seasonFinished(div)) c.season += 1;
  }

  state.save();
  matchEndPanel(overlay, matchState.result, () => {
    if (matchState.isCareer) openCareer();
    else openMenu();
  });
}

function simulateRound() {
  const c = state.data.career;
  const d = c.divisions[c.currentLeague];
  d.fixtures.filter((f) => !f.played).slice(0, 2).forEach((f) => {
    const hg = Math.floor(Math.random() * 5);
    const ag = Math.floor(Math.random() * 5);
    recordResult(d, f.home, f.away, hg, ag);
  });
  state.save();
}

openMenu();
requestAnimationFrame(loop);
