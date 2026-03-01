import { DIFFICULTIES, GAME_TITLE, LEAGUES } from "./config.js";
import { badgeShapes } from "./customization.js";
import { overall, spendPoint, xpToLevel } from "./progression.js";

export function renderHUD(hud, match) {
  if (!match) { hud.innerHTML = ""; return; }
  const time = Math.max(0, Math.ceil(match.time));
  hud.innerHTML = `<div class="hud-strip"><span>${match.left.short} ${match.left.score}</span><span class="pill">${time}s</span><span>${match.right.score} ${match.right.short}</span></div>`;
}

export function showPanel(overlay, html) {
  overlay.innerHTML = `<section class="panel">${html}</section>`;
}

export function wireMenu(state, overlay, handlers) {
  const team = state.teams.find((t) => t.id === state.selectedTeamId);
  showPanel(overlay, `
    <h1 class="brand">${GAME_TITLE}</h1>
    <p class="subbrand">Arcade chaos. Street legends. League glory.</p>
    <p class="small">Selected club: <b>${team.name}</b> (${team.short})</p>
    <div class="menu-grid">
      <button data-act="quick" class="primary">Quick Match</button>
      <button data-act="career">Career / League Mode</button>
      <button data-act="training">Practice / Training</button>
      <button data-act="team">Team Customization</button>
      <button data-act="player">Player Customization</button>
      <button data-act="how">How to Play</button>
      <button data-act="settings">Settings</button>
      <button data-act="credits">Credits</button>
    </div>
  `);
  overlay.querySelectorAll("button").forEach((b) => b.onclick = () => handlers[b.dataset.act]());
}

export function quickMatchPanel(state, overlay, onStart, onBack) {
  const teams = state.teams.map((t) => `<option value="${t.id}">${t.name}</option>`).join("");
  showPanel(overlay, `
    <h2>Quick Match</h2>
    <div class="row"><label>Home</label><select id="homeSel">${teams}</select></div>
    <div class="row"><label>Away</label><select id="awaySel">${teams}</select></div>
    <div class="row"><label>Difficulty</label><select id="diffSel">${Object.keys(DIFFICULTIES).map((d) => `<option>${d}</option>`).join("")}</select></div>
    <div class="row"><label>Length (sec)</label><input id="lenSel" type="number" min="60" max="600" value="180" /></div>
    <div class="row"><button class="primary" id="startBtn">Kick Off</button><button id="backBtn">Back</button></div>
  `);
  overlay.querySelector("#startBtn").onclick = () => onStart({
    home: overlay.querySelector("#homeSel").value,
    away: overlay.querySelector("#awaySel").value,
    difficulty: overlay.querySelector("#diffSel").value,
    length: Number(overlay.querySelector("#lenSel").value),
  });
  overlay.querySelector("#backBtn").onclick = onBack;
}

export function teamCustomizationPanel(state, overlay, onSave, onBack) {
  const t = state.teams.find((x) => x.id === state.selectedTeamId);
  showPanel(overlay, `
    <h2>Team Customization</h2>
    <div class="row"><label>Name</label><input id="name" value="${t.name}"></div>
    <div class="row"><label>Short</label><input id="short" maxlength="4" value="${t.short}"></div>
    <div class="row"><label>Primary</label><input id="primary" type="color" value="${t.primary}"><label>Secondary</label><input id="secondary" type="color" value="${t.secondary}"><label>Accent</label><input id="accent" type="color" value="${t.accent}"></div>
    <div class="row"><label>Badge</label><select id="badge">${badgeShapes.map((b) => `<option ${b===t.badge?"selected":""}>${b}</option>`).join("")}</select></div>
    <div class="row"><button class="primary" id="save">Save</button><button id="back">Back</button></div>
  `);
  overlay.querySelector("#save").onclick = () => onSave({
    name: v("#name"), short: v("#short"), primary: v("#primary"), secondary: v("#secondary"), accent: v("#accent"), badge: v("#badge"),
  });
  overlay.querySelector("#back").onclick = onBack;
  function v(sel) { return overlay.querySelector(sel).value; }
}

export function playerPanel(state, overlay, onSpend, onSaveLook, onBack) {
  const p = state.playerProfile;
  const attrs = Object.entries(p.attrs).map(([k, v]) => `<div class="card"><b>${k}</b><div>${Math.round(v)} ${p.points>0?`<button data-attr="${k}">+</button>`:""}</div></div>`).join("");
  showPanel(overlay, `
    <h2>Player Customization & Growth</h2>
    <p>${p.name} | OVR <b>${overall(p.attrs)}</b> | LV ${p.level} | XP ${p.xp}/${xpToLevel(p.level)} | Points ${p.points}</p>
    <div class="row"><label>Name</label><input id="pname" value="${p.name}"><label>Number</label><input id="shirt" type="number" min="1" max="99" value="${p.shirt}"></div>
    <div class="row"><label>Skin</label><input id="skin" type="color" value="${p.look.skin}"><label>Hair</label><select id="hair"><option>spike</option><option>short</option><option>mohawk</option></select><label>Hair Color</label><input id="hairColor" type="color" value="${p.look.hairColor}"></div>
    <div class="row"><label>Boots</label><input id="boots" type="color" value="${p.look.boots}"><label>Accessory</label><input id="accessory" type="color" value="${p.look.accessory}"></div>
    <div class="card-grid">${attrs}</div>
    <div class="row"><button class="primary" id="saveLook">Save Look</button><button id="back">Back</button></div>
  `);
  overlay.querySelectorAll("[data-attr]").forEach((b) => b.onclick = () => onSpend(b.dataset.attr));
  overlay.querySelector("#saveLook").onclick = () => onSaveLook({
    name: val("#pname"), shirt: val("#shirt"), skin: val("#skin"), hair: val("#hair"), hairColor: val("#hairColor"), boots: val("#boots"), accessory: val("#accessory"),
  });
  overlay.querySelector("#back").onclick = onBack;
  function val(sel) { return overlay.querySelector(sel).value; }
}

export function careerPanel(state, overlay, handlers) {
  const c = state.career;
  const div = c.divisions[c.currentLeague];
  const rows = div.table.map((r, i) => `<tr><td>${i + 1}</td><td>${teamName(state, r.id)}</td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf}</td><td>${r.ga}</td><td>${r.pts}</td></tr>`).join("");
  const next = div.fixtures.find((f) => !f.played && (f.home === c.clubId || f.away === c.clubId));
  showPanel(overlay, `
    <h2>Career Hub - Season ${c.season}</h2>
    <p><span class="pill">${LEAGUES[c.currentLeague].name}</span> Budget ${c.budget} | Fans ${c.fans} | Reputation ${c.rep}</p>
    <p>Objective: ${c.objectives.join(" • ")}</p>
    <h3>Next Fixture</h3>
    <p>${next ? `${teamName(state, next.home)} vs ${teamName(state, next.away)}` : "Season complete"}</p>
    <div class="row"><button class="primary" id="play">Play Next Match</button><button id="sim">Sim Round</button><button id="back">Back</button></div>
    <h3>Standings</h3>
    <table class="table"><thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>Pts</th></tr></thead><tbody>${rows}</tbody></table>
  `);
  overlay.querySelector("#play").onclick = handlers.play;
  overlay.querySelector("#sim").onclick = handlers.sim;
  overlay.querySelector("#back").onclick = handlers.back;
}

export function staticPanel(overlay, title, body, onBack) {
  showPanel(overlay, `<h2>${title}</h2>${body}<div class="row"><button id="back">Back</button></div>`);
  overlay.querySelector("#back").onclick = onBack;
}

export function matchEndPanel(overlay, result, onContinue) {
  showPanel(overlay, `
    <h2>Full Time</h2>
    <p><b>${result.left} - ${result.right}</b></p>
    <p>Winner: ${result.winner}</p>
    <div class="row"><button class="primary" id="continue">Continue</button></div>
  `);
  overlay.querySelector("#continue").onclick = onContinue;
}

function teamName(state, id) { return state.teams.find((t) => t.id === id)?.name || id; }
export { spendPoint };
