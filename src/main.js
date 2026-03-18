const gameTitleOptions = [
  'Rift Rivals',
  'Vector Vanguards',
  'Shardstrike Arena',
  'Ember Circuit',
  'Pulsefront'
];

const visionStatement = 'Rift Rivals is a premium, mobile-first 3v3 hero arena for players who want the pressure, clarity, and tactical depth of ranked team battlers in short, explosive sessions. Its identity blends hand-illustrated future-sport bravado with precise top-down combat, rotating objectives, clean competitive UI, and a roster of sharply readable heroes designed for outplay, coordination, and repeatable mastery.';

const corePillars = [
  'Movement mastery through fast top-down strafing, jukes, and route discipline.',
  'Readable combat built around clean silhouettes, limited palettes, and purposeful VFX.',
  'Objective pressure that creates comeback windows instead of snowballing into hopelessness.',
  'Role expression without hard locks: every hero has a job, but smart play bends expectations.',
  'Ranked presentation that treats every match like a broadcast-ready competition.',
  'Data-driven content and systems built for future real-time multiplayer expansion.'
];

const modes = [
  {
    name: 'Zone Control',
    summary: 'Teams score by controlling active sectors. Rotating zones force repositioning and open comeback routes.',
    rules: [
      'Single or dual capture sectors rotate every 35 seconds on selected maps.',
      'Teams earn points per second while uncontested control is maintained.',
      'Overtime triggers if the losing team is contesting at 100 score or if both teams are within 8 points of victory.',
      'Anchor heroes hold angles while divers pressure flank entries and controllers deny access.'
    ]
  },
  {
    name: 'Crystal Relay',
    summary: 'Relic shards erupt from a neutral core. Hold the target count long enough to secure the relay.',
    rules: [
      'A central crystal forge spawns shards on a timed cadence.',
      'Deaths spill carried shards, creating swing moments and mid-fight target swaps.',
      'Reaching the hold threshold starts a visible countdown that pauses when control is broken.',
      'Escort, retreat timing, and collapse calls matter more than raw elimination counts.'
    ]
  },
  {
    name: 'Knockout Protocol',
    summary: 'Round-based elimination with a tightening hazard field that forces committed engagements.',
    rules: [
      'Best-of-five round structure with one life per hero each round.',
      'A danger ring begins collapsing after 22 seconds to prevent passive stalling.',
      'Peeking, cooldown tracking, and coordinated isolates are emphasized.',
      'The mode is tuned for clutch potential and spectator readability.'
    ]
  }
];

const heroes = [
  {
    name: 'Astra Vale', role: 'Sharpshooter', range: 'Long', color: '#65d8ff',
    lore: 'A former orbital survey ace who now turns precision telemetry into arena dominance.',
    identity: 'Lane control marksman with piercing rail shots and anti-dive spacing tools.',
    hook: 'Her passive “Sightline” reveals enemies briefly after two consecutive hits.',
    abilities: ['Primary: Tri-rail burst that rewards tracking.', 'Tactical: Prism Step dash that drops a decoy reticle.', 'Ultimate: Horizon Lance piercing beam for clutch confirms.'],
    silhouette: 'Long coat tails, shoulder antenna fins, compact rifle profile.',
    accents: 'Icy cyan, graphite, signal white.'
  },
  {
    name: 'Bront', role: 'Vanguard', range: 'Close', color: '#ff8a5b',
    lore: 'A disciplined arena breaker who channels seismic force through an impact maul.',
    identity: 'Bruiser initiator built to breach chokes and create space for teammates.',
    hook: 'Passive grants damage reduction while moving toward contested objectives.',
    abilities: ['Primary: Sweeping shock-slam arcs.', 'Tactical: Bulwark Rush shoulder drive with brief unstoppable frames.', 'Ultimate: Faultline Dome that knocks out enemies at the center edge.'],
    silhouette: 'Massive forearms, slab shield generator, forward-leaning charge pose.',
    accents: 'Molten orange, iron, ember gold.'
  },
  {
    name: 'Nyx Kade', role: 'Skirmisher', range: 'Mid', color: '#b084ff',
    lore: 'A contract ghost who weaponized light-bending blades for televised combat.',
    identity: 'Assassin flanker that thrives on angle swaps and isolate windows.',
    hook: 'Passive reloads a blade instantly after leaving enemy vision.',
    abilities: ['Primary: Fan of ricochet knives.', 'Tactical: Veil Zip short blink through cover gaps.', 'Ultimate: Afterimage Barrage around a marked target.'],
    silhouette: 'Asymmetric cape, twin crescent daggers, catlike crouch.',
    accents: 'Violet, black plum, silver.'
  },
  {
    name: 'Morrow Quill', role: 'Controller', range: 'Mid', color: '#7df0b5',
    lore: 'A former city planner who repurposed adaptive hard-light grids into tactical geometry.',
    identity: 'Zone-denial specialist for objective anchoring and lane shaping.',
    hook: 'Passive extends allied ability haste when they fight inside his constructs.',
    abilities: ['Primary: Hex bolts that burst into slowing patterns.', 'Tactical: Vector Wall with directional cover windows.', 'Ultimate: Lockfield lattice that suppresses dashes.'],
    silhouette: 'Tall collar, floating drafting halo, geometric gauntlet.',
    accents: 'Mint, obsidian, clean ivory.'
  },
  {
    name: 'Solenne', role: 'Support', range: 'Mid', color: '#ffd36a',
    lore: 'A championship medic who treats every teamfight like a rhythm exercise.',
    identity: 'Tempo healer focused on burst saves and speed-based repositioning.',
    hook: 'Passive stores “Tempo” through heals and converts it into speed pulses.',
    abilities: ['Primary: Harmonic bolts that heal allies or chip enemies.', 'Tactical: Rescue Arc tether burst heal plus cleanse.', 'Ultimate: Anthem Surge teamwide haste and barrier pulse.'],
    silhouette: 'Circular halo rig, slim baton, forward dancer stance.',
    accents: 'Warm gold, rose cream, navy.'
  },
  {
    name: 'Rook Ember', role: 'Anti-Dive Anchor', range: 'Mid', color: '#ff6b7a',
    lore: 'A retired bodyguard who now protects lanes with magnetic buckler tech.',
    identity: 'Peel defender with punishing counter-engage and frontline stabilization.',
    hook: 'Passive marks nearby flankers, amplifying allied damage on them.',
    abilities: ['Primary: Buckler shots that rebound near allies.', 'Tactical: Guard Pull yanks an ally to safety.', 'Ultimate: Bastion Ring denies dash entry and grants cover.'],
    silhouette: 'Broad shoulder disc, compact stance, heavy buckler.',
    accents: 'Crimson, gunmetal, cream.'
  },
  {
    name: 'Talon Mire', role: 'Disruptor', range: 'Mid', color: '#82f06b',
    lore: 'A salvage chemist who built elegant hazard rigs from refinery castoffs.',
    identity: 'Trap setter with delayed punish tools and vision denial.',
    hook: 'Passive empowers traps near walls and cover edges.',
    abilities: ['Primary: Corrosive capsules that linger briefly.', 'Tactical: Snap Mine tripwire seed.', 'Ultimate: Mire Bloom spreads chain-reactive puddles.'],
    silhouette: 'Lean respirator mask, satchel canisters, hooked injector staff.',
    accents: 'Toxic lime, charcoal, pale tan.'
  },
  {
    name: 'Vexa Rune', role: 'Artillery', range: 'Very Long', color: '#6fb5ff',
    lore: 'A rogue weather architect aiming to dominate from impossible sightlines.',
    identity: 'Long-range pressure artillery with punishable commitment windows.',
    hook: 'Passive improves splash radius after stationary channeling.',
    abilities: ['Primary: Delayed impact shells with telegraphed landing rings.', 'Tactical: Drift Thrusters for repositioning.', 'Ultimate: Skybreak volley saturating selected sectors.'],
    silhouette: 'Floating shell rack, oversized visor, tripod stance.',
    accents: 'Storm blue, white, slate.'
  },
  {
    name: 'Kiro Flux', role: 'Flex Duelist', range: 'Mid', color: '#00d1a7',
    lore: 'A kinetic sports phenom whose gauntlets convert enemy fire into momentum.',
    identity: 'Adaptive duelist that brawls best when weaving between pressure and retreat.',
    hook: 'Passive stores glancing projectile hits as bonus move speed.',
    abilities: ['Primary: Pulse jabs fired in quick succession.', 'Tactical: Slingstep lateral burst with ammo refund.', 'Ultimate: Flux Drive chain combo with knockback finisher.'],
    silhouette: 'Athletic scarf ribbons, compact gauntlets, boxer footwork.',
    accents: 'Teal, coral, smoke black.'
  }
];

const maps = [
  {
    mode: 'Zone Control', name: 'Cinder Yard', theme: 'Industrial rail depot under a molten dusk.',
    features: ['Mirror-flank catwalks', 'Central heat vents for temporary cover breaks', 'Rotating inner sector']
  },
  {
    mode: 'Zone Control', name: 'Glassline Forum', theme: 'Broadcast plaza with luminous lane separators.',
    features: ['Clean octagonal mid', 'Side sculpture cover', 'Late-game dual-zone variant']
  },
  {
    mode: 'Crystal Relay', name: 'Verdant Spire', theme: 'Vertical greenhouse ruins around a crystal root.',
    features: ['Tight mid ring', 'Safe retreat ramps', 'Ambush alcoves without bush spam']
  },
  {
    mode: 'Crystal Relay', name: 'Halcyon Vault', theme: 'Secure archive chamber with shifting containment shutters.',
    features: ['Contested central forge', 'Parallel flank galleries', 'Readable drop choke at extraction lane']
  },
  {
    mode: 'Knockout Protocol', name: 'Obsidian Steps', theme: 'Ceremonial basalt arena with narrow power angles.',
    features: ['Diagonal peek routes', 'Late ring pressure', 'Single decisive high-ground shelf']
  },
  {
    mode: 'Knockout Protocol', name: 'Neon Causeway', theme: 'Rain-slick bridge district with modular barricades.',
    features: ['Duel-heavy open lane', 'Audio-readable hard cover', 'Fast collapse timing']
  }
];

const rankedTiers = [
  'Copper', 'Bronze', 'Silver', 'Gold', 'Onyx', 'Ascendant', 'Paragon', 'Apex'
];

const styleGuide = {
  typography: ['Sora for headings, Space Grotesk for interface and body copy.', 'Heavy all-caps reserved for ranked stakes moments only.'],
  buttons: ['Chamfered cards with dual-border highlights.', 'Press states shift 2px downward with inner glow compression.'],
  panels: ['Layered matte surfaces, subtle top-edge specular stroke, controlled noise texture.', '12 / 20 / 28 radius system to separate cards, sheets, and modal stage panels.'],
  icons: ['Filled core with confident outer stroke.', 'No default icon packs; every role and stat icon uses the same angled cut motif.'],
  color: ['Hero accents remain limited to one primary and one support hue.', 'Objectives use cyan for neutral, ember for Team A, violet for Team B.'],
  vfx: ['Impacts are bright at the core with fast evaporating directional shards.', 'Area control effects use perimeter emphasis instead of opaque fills.']
};

const implementationPlan = [
  'Establish the IP pillar, style guide, and content data tables before UI production.',
  'Implement responsive shell: menu flow, roster, ranked presentation, and results layers.',
  'Build the core top-down simulation with touch/mouse controls, projectiles, abilities, bots, and mode logic.',
  'Add objective systems for rotating zones, crystal relay logic, and round-based knockout.',
  'Tune readability: silhouettes, contrast, hit VFX, camera behavior, and HUD clarity.',
  'Integrate progression scaffolding, stat tracking, and post-match performance summaries.',
  'Profile mobile performance, pool effects/projectiles, reduce allocations, and harden input latency.',
  'Prepare networking seams: deterministic-ish state modules, snapshot hooks, and authority boundaries.'
];

const finalPolishChecklist = [
  'Every hero portrait, HUD icon, and panel uses the same shape language.',
  'No effect obscures enemy silhouettes longer than a fraction of a second.',
  'Ranked queue, draft, versus, gameplay, and results screens form a coherent emotional arc.',
  'Bots feel competitive but fair, with visible hesitation, dodges, and objective awareness.',
  'Mobile touch targets respect thumb reach and safe-area insets.',
  'All player-facing copy is premium, specific, and free of placeholder naming.'
];

const app = document.querySelector('#app');

const state = {
  screen: 'play',
  selectedMode: 'Zone Control',
  selectedHero: heroes[0].name,
  selectedMap: maps[0].name,
  selectedTab: 'overview',
  hoveredHero: heroes[0].name,
  queueSeed: 2,
  rankIndex: 3,
  division: 2,
  rr: 64,
  match: null,
  touchMove: null,
  touchAim: null,
  lastTime: 0,
  effects: []
};

function el(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.innerHTML = content;
  return node;
}

function render() {
  app.innerHTML = '';
  app.appendChild(renderShell());
  if (state.screen === 'play') startMatch();
}

function renderShell() {
  const shell = el('div', 'shell');
  shell.appendChild(renderSidebar());
  shell.appendChild(renderMain());
  return shell;
}

function renderSidebar() {
  const side = el('aside', 'sidebar');
  side.innerHTML = `
    <div class="brand-card">
      <div class="eyebrow">Original 3v3 Competitive Arena</div>
      <h1>Rift Rivals</h1>
      <p>${visionStatement}</p>
      <div class="title-options">${gameTitleOptions.map((t) => `<span>${t}</span>`).join('')}</div>
    </div>
    <nav class="nav-stack">
      ${[
        ['menu', 'Command Deck'],
        ['roster', 'Hero Roster'],
        ['ranked', 'Ranked Ops'],
        ['design', 'Studio Guide'],
        ['play', 'Launch Scrim']
      ].map(([id, label]) => `<button class="nav-btn ${state.screen===id?'active':''}" data-screen="${id}">${label}</button>`).join('')}
    </nav>
    <div class="side-stats panel">
      <div><span>Current rank</span><strong>${rankedTiers[state.rankIndex]} Division ${state.division}</strong></div>
      <div><span>Rank rating</span><strong>${state.rr} RR</strong></div>
      <div><span>Queue target</span><strong>2.5–4 min matches</strong></div>
    </div>
  `;
  side.querySelectorAll('[data-screen]').forEach((btn) => btn.onclick = () => { state.screen = btn.dataset.screen; render(); });
  return side;
}

function renderMain() {
  const main = el('main', 'main');
  if (state.screen === 'menu') main.appendChild(renderOverview());
  if (state.screen === 'roster') main.appendChild(renderRoster());
  if (state.screen === 'ranked') main.appendChild(renderRanked());
  if (state.screen === 'design') main.appendChild(renderDesignGuide());
  if (state.screen === 'play') main.appendChild(renderPlay());
  return main;
}

function renderOverview() {
  const wrap = el('section', 'content-grid');
  const hero = heroes.find((h) => h.name === state.selectedHero);
  wrap.innerHTML = `
    <section class="hero stage panel luxe">
      <div class="eyebrow">Competitive Vision</div>
      <h2>Short-form hero combat with ranked weight.</h2>
      <p>${visionStatement}</p>
      <div class="bullet-grid">
        ${corePillars.map((pillar) => `<article><h3>Pillar</h3><p>${pillar}</p></article>`).join('')}
      </div>
    </section>
    <section class="panel modes-panel">
      <div class="panel-heading"><span>Ranked-ready modes</span><strong>Objective depth</strong></div>
      ${modes.map((mode) => `
        <article class="mode-card ${state.selectedMode===mode.name?'selected':''}" data-mode="${mode.name}">
          <div>
            <h3>${mode.name}</h3>
            <p>${mode.summary}</p>
          </div>
          <ul>${mode.rules.map((r)=>`<li>${r}</li>`).join('')}</ul>
        </article>`).join('')}
    </section>
    <section class="panel spotlight">
      <div class="panel-heading"><span>Featured hero</span><strong>${hero.role}</strong></div>
      <div class="hero-silhouette" style="--hero:${hero.color}"></div>
      <h3>${hero.name}</h3>
      <p>${hero.identity}</p>
      <ul>${hero.abilities.map((a)=>`<li>${a}</li>`).join('')}</ul>
    </section>
  `;
  wrap.querySelectorAll('[data-mode]').forEach((node) => node.onclick = () => { state.selectedMode = node.dataset.mode; state.selectedMap = maps.find((m)=>m.mode===state.selectedMode).name; render(); });
  return wrap;
}

function renderRoster() {
  const selected = heroes.find((h)=>h.name===state.selectedHero);
  const wrap = el('section', 'roster-layout');
  wrap.innerHTML = `
    <section class="panel roster-list">
      <div class="panel-heading"><span>Launch roster</span><strong>${heroes.length} heroes</strong></div>
      <div class="hero-list">${heroes.map((hero)=>`
        <button class="hero-chip ${state.selectedHero===hero.name?'active':''}" data-hero="${hero.name}" style="--accent:${hero.color}">
          <span class="swatch"></span>
          <span><strong>${hero.name}</strong><em>${hero.role}</em></span>
          <small>${hero.range}</small>
        </button>`).join('')}</div>
    </section>
    <section class="panel hero-detail">
      <div class="detail-top">
        <div>
          <div class="eyebrow">${selected.role} • ${selected.range} engagement</div>
          <h2>${selected.name}</h2>
          <p>${selected.lore}</p>
        </div>
        <div class="portrait-card" style="--accent:${selected.color}">
          <div class="portrait-shape"></div>
          <div class="portrait-meta">
            <span>Silhouette</span>
            <strong>${selected.silhouette}</strong>
          </div>
        </div>
      </div>
      <div class="detail-grid">
        <article><h3>Gameplay identity</h3><p>${selected.identity}</p></article>
        <article><h3>Signature hook</h3><p>${selected.hook}</p></article>
        <article><h3>Accent palette</h3><p>${selected.accents}</p></article>
        <article><h3>Animation poses</h3><p>Idle silhouette lock, combat anticipation, victory signature pose tailored to ${selected.name}.</p></article>
      </div>
      <div class="abilities-list">${selected.abilities.map((a)=>`<div>${a}</div>`).join('')}</div>
    </section>
  `;
  wrap.querySelectorAll('[data-hero]').forEach((node)=>node.onclick=()=>{state.selectedHero=node.dataset.hero; render();});
  return wrap;
}

function renderRanked() {
  const wrap = el('section', 'ranked-layout');
  wrap.innerHTML = `
    <section class="panel ranked-card luxe">
      <div class="panel-heading"><span>Ranked ladder</span><strong>${rankedTiers[state.rankIndex]} • Division ${state.division}</strong></div>
      <h2>Promotion pressure without fake inflation.</h2>
      <div class="rank-progress"><div style="width:${state.rr}%"></div></div>
      <div class="detail-grid">
        <article><h3>Tiers</h3><p>${rankedTiers.join(', ')}</p></article>
        <article><h3>RR rules</h3><p>Win/loss primary. Performance weighting applies more at lower tiers and tapers upward. Win streak bonuses stop after Gold.</p></article>
        <article><h3>Draft flow</h3><p>Mode-map reveal, optional advanced bans, hero select with role readability, broadcast-grade versus intro.</p></article>
        <article><h3>Post-match panel</h3><p>Damage, healing, eliminations, assists, deaths, control time, objective contribution, clutch badges, and RR delta.</p></article>
      </div>
    </section>
    <section class="panel matchmake-panel">
      <div class="panel-heading"><span>Queue staging</span><strong>Ranked prototype</strong></div>
      <div class="queue-grid">
        <label>Mode
          <select id="modeSelect">${modes.map((m)=>`<option ${state.selectedMode===m.name?'selected':''}>${m.name}</option>`).join('')}</select>
        </label>
        <label>Map
          <select id="mapSelect">${maps.filter((m)=>m.mode===state.selectedMode).map((m)=>`<option ${state.selectedMap===m.name?'selected':''}>${m.name}</option>`).join('')}</select>
        </label>
        <label>Hero
          <select id="heroSelect">${heroes.map((h)=>`<option ${state.selectedHero===h.name?'selected':''}>${h.name}</option>`).join('')}</select>
        </label>
      </div>
      <div class="match-flow">
        ${['Queue', 'Mode + Map', 'Versus', 'Hero Lock', 'Intro Fly-In', 'Match', 'Results', 'Queue Again'].map((step, i)=>`<div><span>${i+1}</span><strong>${step}</strong></div>`).join('')}
      </div>
      <button class="cta" id="launchRanked">Launch ranked scrim</button>
    </section>
  `;
  wrap.querySelector('#modeSelect').onchange = (e)=>{state.selectedMode=e.target.value; state.selectedMap = maps.find((m)=>m.mode===state.selectedMode).name; render();};
  wrap.querySelector('#mapSelect').onchange = (e)=>{state.selectedMap=e.target.value;};
  wrap.querySelector('#heroSelect').onchange = (e)=>{state.selectedHero=e.target.value;};
  wrap.querySelector('#launchRanked').onclick = ()=>{state.screen='play'; render();};
  return wrap;
}

function renderDesignGuide() {
  const wrap = el('section', 'design-layout');
  wrap.innerHTML = `
    <section class="panel guide-block luxe">
      <div class="panel-heading"><span>Art direction</span><strong>Hand-authored competitive style</strong></div>
      <div class="detail-grid">
        <article><h3>Typography</h3><ul>${styleGuide.typography.map((t)=>`<li>${t}</li>`).join('')}</ul></article>
        <article><h3>Buttons</h3><ul>${styleGuide.buttons.map((t)=>`<li>${t}</li>`).join('')}</ul></article>
        <article><h3>Panels</h3><ul>${styleGuide.panels.map((t)=>`<li>${t}</li>`).join('')}</ul></article>
        <article><h3>Icon rules</h3><ul>${styleGuide.icons.map((t)=>`<li>${t}</li>`).join('')}</ul></article>
        <article><h3>Hero color coding</h3><ul>${styleGuide.color.map((t)=>`<li>${t}</li>`).join('')}</ul></article>
        <article><h3>VFX language</h3><ul>${styleGuide.vfx.map((t)=>`<li>${t}</li>`).join('')}</ul></article>
      </div>
    </section>
    <section class="panel guide-block">
      <div class="panel-heading"><span>Map pool concepts</span><strong>Competitive readability</strong></div>
      <div class="bullet-grid">${maps.map((map)=>`<article><h3>${map.name}</h3><p>${map.theme}</p><ul>${map.features.map((f)=>`<li>${f}</li>`).join('')}</ul></article>`).join('')}</div>
    </section>
    <section class="panel guide-block">
      <div class="panel-heading"><span>Implementation roadmap</span><strong>Studio plan</strong></div>
      <ol class="roadmap-list">${implementationPlan.map((item)=>`<li>${item}</li>`).join('')}</ol>
      <h3>Final polish checklist</h3>
      <ul>${finalPolishChecklist.map((item)=>`<li>${item}</li>`).join('')}</ul>
    </section>
  `;
  return wrap;
}

function renderPlay() {
  const wrap = el('section', 'play-layout');
  wrap.innerHTML = `
    <section class="panel play-stage luxe">
      <div class="versus-strip">
        <div>
          <span class="eyebrow">Ranked scrim</span>
          <h2>${state.selectedMode} • ${state.selectedMap}</h2>
        </div>
        <button class="ghost-btn" id="leaveMatch">Return to command deck</button>
      </div>
      <canvas id="gameCanvas" width="920" height="540" aria-label="Rift Rivals playable arena"></canvas>
      <div class="hud-controls">
        <div class="touch-card">
          <strong>Mobile controls</strong>
          <p>Left thumb move stick. Right thumb aim/fire. Tactical on tap, ultimate on double-tap.</p>
        </div>
        <div class="touch-card">
          <strong>Desktop controls</strong>
          <p>WASD move • Mouse aim • Hold LMB fire • Space tactical • Q ultimate.</p>
        </div>
      </div>
    </section>
    <section class="panel results-side">
      <div class="panel-heading"><span>Live brief</span><strong>${state.selectedHero}</strong></div>
      <div id="liveSummary" class="live-summary"></div>
      <div class="panel-heading"><span>Competitive systems</span><strong>Bot intelligence</strong></div>
      <ul class="system-list">
        <li>Role-aware pathing, retreat thresholds, and objective timing.</li>
        <li>Aim inaccuracy, reaction delay, and dodge windows to avoid robotic snap play.</li>
        <li>Gem escort, last-second contest, clutch focus fire, and knockout patience.</li>
        <li>Readable danger ring, rotating sectors, and comeback-focused score rules.</li>
      </ul>
    </section>
  `;
  wrap.querySelector('#leaveMatch').onclick = ()=>{stopMatch(); state.screen='menu'; render();};
  return wrap;
}

const keys = new Set();
const pointer = { x: 0, y: 0, down: false };
window.addEventListener('keydown', (e) => keys.add(e.key.toLowerCase()));
window.addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
window.addEventListener('pointermove', (e) => {
  const canvas = document.querySelector('#gameCanvas');
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * canvas.width;
  pointer.y = ((e.clientY - rect.top) / rect.height) * canvas.height;
});
window.addEventListener('pointerdown', ()=> pointer.down = true);
window.addEventListener('pointerup', ()=> pointer.down = false);

function heroArchetype(hero) {
  const table = {
    'Astra Vale': { speed: 128, hp: 85, projectileSpeed: 420, fireRate: 0.52, damage: 10, color: hero.color },
    'Bront': { speed: 104, hp: 140, projectileSpeed: 300, fireRate: 0.72, damage: 16, color: hero.color },
    'Nyx Kade': { speed: 138, hp: 82, projectileSpeed: 360, fireRate: 0.48, damage: 9, color: hero.color },
    'Morrow Quill': { speed: 112, hp: 105, projectileSpeed: 300, fireRate: 0.66, damage: 8, color: hero.color },
    'Solenne': { speed: 118, hp: 95, projectileSpeed: 320, fireRate: 0.58, damage: 7, color: hero.color },
    'Rook Ember': { speed: 108, hp: 120, projectileSpeed: 330, fireRate: 0.62, damage: 8, color: hero.color },
    'Talon Mire': { speed: 114, hp: 98, projectileSpeed: 290, fireRate: 0.68, damage: 7, color: hero.color },
    'Vexa Rune': { speed: 100, hp: 80, projectileSpeed: 240, fireRate: 1.0, damage: 15, color: hero.color },
    'Kiro Flux': { speed: 130, hp: 102, projectileSpeed: 360, fireRate: 0.4, damage: 8, color: hero.color }
  };
  return table[hero.name];
}

function createMatch() {
  const selectedHero = heroes.find((h)=>h.name===state.selectedHero);
  const alliedPool = heroes.filter((h)=>h.name!==selectedHero.name);
  const enemyPool = heroes.filter((h)=>h.name!==selectedHero.name);
  const player = makeUnit(selectedHero, 'A', true, 140, 270);
  const allies = [
    makeUnit(alliedPool[(state.queueSeed+1)%alliedPool.length], 'A', false, 96, 212),
    makeUnit(alliedPool[(state.queueSeed+3)%alliedPool.length], 'A', false, 96, 328)
  ];
  const enemies = [
    makeUnit(enemyPool[(state.queueSeed+2)%enemyPool.length], 'B', false, 780, 212),
    makeUnit(enemyPool[(state.queueSeed+4)%enemyPool.length], 'B', false, 780, 270),
    makeUnit(enemyPool[(state.queueSeed+5)%enemyPool.length], 'B', false, 780, 328)
  ];
  return {
    mode: state.selectedMode,
    map: state.selectedMap,
    time: 180,
    over: false,
    round: 1,
    roundWins: { A: 0, B: 0 },
    score: { A: 0, B: 0 },
    crystalHold: { A: 0, B: 0 },
    crystals: [],
    projectiles: [],
    fields: [],
    objective: { x: 460, y: 270, radius: 76, activeZone: 0, rotateTimer: 18, ring: 0 },
    units: [player, ...allies, ...enemies],
    killfeed: [],
    eventText: 'Match live',
    lastTactical: 0,
    lastUltimate: 0
  };
}

function makeUnit(hero, team, isPlayer, x, y) {
  const stats = heroArchetype(hero);
  return {
    id: `${team}-${hero.name}`,
    hero,
    team,
    isPlayer,
    x, y,
    vx: 0, vy: 0,
    aimX: team === 'A' ? 1 : -1,
    aimY: 0,
    hp: stats.hp,
    maxHp: stats.hp,
    speed: stats.speed,
    damage: stats.damage,
    projectileSpeed: stats.projectileSpeed,
    fireRate: stats.fireRate,
    fireCooldown: Math.random() * stats.fireRate,
    tacticalCooldown: 0,
    ultimateCharge: 45,
    ultimateCooldown: 0,
    respawn: 0,
    shards: 0,
    personality: isPlayer ? 'player' : ['aggressive diver','safe objective player','supportive backline','trap-oriented controller','opportunistic finisher'][Math.floor(Math.random()*5)],
    targetId: null,
    strafing: Math.random() > 0.5 ? 1 : -1,
    reaction: 0.08 + Math.random() * 0.22,
    tacticalBias: Math.random() * 0.8 + 0.2,
    wanderSeed: Math.random() * Math.PI * 2,
    coverBias: Math.random(),
    controlTime: 0,
    eliminations: 0,
    assists: 0,
    healing: 0,
    damageDone: 0,
    deaths: 0,
    clutch: 0
  };
}

let animationHandle = 0;

function startMatch() {
  if (state.match) return;
  state.match = createMatch();
  state.lastTime = performance.now();
  const canvas = document.querySelector('#gameCanvas');
  if (!canvas) return;
  bindTouch(canvas);
  const tick = (now) => {
    if (!state.match) return;
    const dt = Math.min(0.033, (now - state.lastTime) / 1000);
    state.lastTime = now;
    updateMatch(state.match, dt, canvas);
    renderMatch(state.match, canvas);
    updateLiveSummary();
    animationHandle = requestAnimationFrame(tick);
  };
  animationHandle = requestAnimationFrame(tick);
}

function stopMatch() {
  cancelAnimationFrame(animationHandle);
  state.match = null;
}

function bindTouch(canvas) {
  const sticks = {};
  canvas.ontouchstart = (e) => {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      const rect = canvas.getBoundingClientRect();
      const point = { x: (touch.clientX-rect.left)/rect.width*canvas.width, y: (touch.clientY-rect.top)/rect.height*canvas.height };
      sticks[touch.identifier] = { startX: point.x, startY: point.y, x: point.x, y: point.y, side: point.x < canvas.width/2 ? 'move' : 'aim', tapTime: performance.now() };
    }
    assignTouch(sticks);
  };
  canvas.ontouchmove = (e) => {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      const rect = canvas.getBoundingClientRect();
      const stick = sticks[touch.identifier];
      if (!stick) continue;
      stick.x = (touch.clientX-rect.left)/rect.width*canvas.width;
      stick.y = (touch.clientY-rect.top)/rect.height*canvas.height;
    }
    assignTouch(sticks);
  };
  canvas.ontouchend = (e) => {
    e.preventDefault();
    for (const touch of e.changedTouches) delete sticks[touch.identifier];
    assignTouch(sticks);
  };
}

function assignTouch(sticks) {
  state.touchMove = null;
  state.touchAim = null;
  for (const stick of Object.values(sticks)) {
    if (stick.side === 'move') state.touchMove = stick;
    if (stick.side === 'aim') state.touchAim = stick;
  }
}

function updateMatch(match, dt, canvas) {
  match.time -= dt;
  if (match.time <= 0 && match.mode !== 'Knockout Protocol') match.over = true;
  if (match.mode === 'Zone Control') updateZoneMode(match, dt);
  if (match.mode === 'Crystal Relay') updateCrystalMode(match, dt);
  if (match.mode === 'Knockout Protocol') updateKnockoutMode(match, dt);

  for (const unit of match.units) {
    if (unit.respawn > 0) {
      unit.respawn -= dt;
      if (unit.respawn <= 0) respawnUnit(unit);
      continue;
    }
    if (unit.isPlayer) updatePlayer(unit, dt, match, canvas);
    else updateBot(unit, dt, match);
    unit.fireCooldown -= dt;
    unit.tacticalCooldown = Math.max(0, unit.tacticalCooldown - dt);
    unit.ultimateCooldown = Math.max(0, unit.ultimateCooldown - dt);
    unit.ultimateCharge = Math.min(100, unit.ultimateCharge + dt * 3.2);
    unit.x = clamp(unit.x + unit.vx * dt, 36, 884);
    unit.y = clamp(unit.y + unit.vy * dt, 36, 504);
  }

  for (const projectile of match.projectiles) {
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.life -= dt;
    const targets = match.units.filter((u)=>u.team!==projectile.team && u.respawn<=0);
    for (const target of targets) {
      const dist = Math.hypot(target.x - projectile.x, target.y - projectile.y);
      if (dist < projectile.radius + 14) {
        hitUnit(match, target, projectile.damage, projectile.owner);
        projectile.life = 0;
        break;
      }
    }
  }
  match.projectiles = match.projectiles.filter((p)=>p.life>0 && p.x>0 && p.x<920 && p.y>0 && p.y<540);
  match.fields = match.fields.filter((field)=> (field.life -= dt) > 0);
}

function updatePlayer(player, dt, match, canvas) {
  let moveX = 0, moveY = 0;
  if (keys.has('w')) moveY -= 1;
  if (keys.has('s')) moveY += 1;
  if (keys.has('a')) moveX -= 1;
  if (keys.has('d')) moveX += 1;
  if (state.touchMove) {
    moveX = (state.touchMove.x - state.touchMove.startX) / 40;
    moveY = (state.touchMove.y - state.touchMove.startY) / 40;
  }
  const len = Math.hypot(moveX, moveY) || 1;
  player.vx = moveX / len * player.speed;
  player.vy = moveY / len * player.speed;

  let aimX = pointer.x - player.x;
  let aimY = pointer.y - player.y;
  const firing = pointer.down || !!state.touchAim;
  if (state.touchAim) {
    aimX = state.touchAim.x - state.touchAim.startX;
    aimY = state.touchAim.y - state.touchAim.startY;
  }
  const aimLen = Math.hypot(aimX, aimY) || 1;
  player.aimX = aimX / aimLen;
  player.aimY = aimY / aimLen;
  if (firing && player.fireCooldown <= 0) fireProjectile(match, player, player.aimX, player.aimY);
  if ((keys.has(' ') || tapped(state.touchAim, 240)) && player.tacticalCooldown <= 0) useTactical(match, player);
  if ((keys.has('q') || doubleTapped(state.touchAim, 260)) && player.ultimateCharge >= 100 && player.ultimateCooldown <= 0) useUltimate(match, player);
}

function tapped(stick, windowMs) {
  if (!stick) return false;
  const now = performance.now();
  if (now - stick.tapTime < windowMs && !stick.usedTap) { stick.usedTap = true; return true; }
  return false;
}
function doubleTapped(stick, windowMs) {
  if (!stick) return false;
  const now = performance.now();
  if (!stick.lastTap) stick.lastTap = now;
  const delta = now - stick.lastTap;
  stick.lastTap = now;
  if (delta < windowMs && !stick.usedDouble) { stick.usedDouble = true; return true; }
  return false;
}

function updateBot(bot, dt, match) {
  const allies = match.units.filter((u)=>u.team===bot.team && u!==bot && u.respawn<=0);
  const enemies = match.units.filter((u)=>u.team!==bot.team && u.respawn<=0);
  const lowSelf = bot.hp / bot.maxHp < 0.32;
  const target = chooseTarget(bot, enemies, match);
  if (!target) return;
  bot.targetId = target.id;
  const dx = target.x - bot.x;
  const dy = target.y - bot.y;
  const dist = Math.hypot(dx, dy) || 1;
  bot.aimX += ((dx/dist) - bot.aimX) * Math.min(1, dt / bot.reaction);
  bot.aimY += ((dy/dist) - bot.aimY) * Math.min(1, dt / bot.reaction);

  const objectiveVector = objectiveSeek(bot, match);
  let moveX = objectiveVector.x;
  let moveY = objectiveVector.y;

  if (lowSelf) {
    moveX = -dx / dist + (allies[0] ? (allies[0].x - bot.x) / 200 : 0);
    moveY = -dy / dist + (allies[0] ? (allies[0].y - bot.y) / 200 : 0);
  } else if (dist < desiredRange(bot) * 0.7) {
    moveX = -dx / dist + (dy / dist) * 0.6 * bot.strafing;
    moveY = -dy / dist - (dx / dist) * 0.6 * bot.strafing;
  } else if (dist > desiredRange(bot) * 1.15) {
    moveX += dx / dist;
    moveY += dy / dist;
  } else {
    moveX += (dy / dist) * 0.65 * bot.strafing;
    moveY += (-dx / dist) * 0.65 * bot.strafing;
  }

  const moveLen = Math.hypot(moveX, moveY) || 1;
  bot.vx = moveX / moveLen * bot.speed;
  bot.vy = moveY / moveLen * bot.speed;

  const aimNoise = bot.personality === 'supportive backline' ? 0.08 : 0.14;
  const ax = bot.aimX + (Math.random()-0.5) * aimNoise;
  const ay = bot.aimY + (Math.random()-0.5) * aimNoise;
  if (bot.fireCooldown <= 0 && dist < desiredRange(bot) * 1.35) fireProjectile(match, bot, ax, ay);
  if (bot.tacticalCooldown <= 0 && (lowSelf || Math.random() < bot.tacticalBias * dt)) useTactical(match, bot);
  if (bot.ultimateCharge >= 100 && bot.ultimateCooldown <= 0 && shouldUltimate(bot, enemies, match)) useUltimate(match, bot);
}

function objectiveSeek(bot, match) {
  const obj = match.objective;
  if (match.mode === 'Zone Control') return { x: (obj.x - bot.x) / 160, y: (obj.y - bot.y) / 160 };
  if (match.mode === 'Crystal Relay') {
    const carrier = match.units.find((u)=>u.team===bot.team && u.shards>=4 && u.respawn<=0);
    if (carrier && carrier !== bot) return { x: (carrier.x - bot.x) / 180, y: (carrier.y - bot.y) / 180 };
    return { x: (obj.x - bot.x) / 160, y: (obj.y - bot.y) / 160 };
  }
  if (match.mode === 'Knockout Protocol') {
    const ringCenter = { x: 460, y: 270 };
    return { x: (ringCenter.x - bot.x) / 220, y: (ringCenter.y - bot.y) / 220 };
  }
  return { x: 0, y: 0 };
}

function chooseTarget(bot, enemies, match) {
  const low = enemies.filter((e)=>e.hp/e.maxHp < 0.42);
  const shardCarrier = enemies.find((e)=>e.shards>0);
  return shardCarrier || low[0] || enemies.sort((a,b)=>Math.hypot(bot.x-a.x, bot.y-a.y)-Math.hypot(bot.x-b.x, bot.y-b.y))[0];
}

function desiredRange(bot) {
  if (bot.hero.role === 'Vanguard') return 90;
  if (bot.hero.role === 'Skirmisher') return 120;
  if (bot.hero.role === 'Artillery') return 250;
  if (bot.hero.role === 'Sharpshooter') return 220;
  if (bot.hero.role === 'Support') return 170;
  return 160;
}

function shouldUltimate(bot, enemies, match) {
  const nearby = enemies.filter((e)=>Math.hypot(bot.x-e.x, bot.y-e.y) < 150);
  return nearby.length >= 2 || (match.mode === 'Crystal Relay' && enemies.some((e)=>e.shards>=4));
}

function fireProjectile(match, unit, aimX, aimY) {
  const len = Math.hypot(aimX, aimY) || 1;
  match.projectiles.push({
    x: unit.x + (aimX/len) * 18,
    y: unit.y + (aimY/len) * 18,
    vx: aimX/len * unit.projectileSpeed,
    vy: aimY/len * unit.projectileSpeed,
    life: 1.1,
    damage: unit.damage,
    team: unit.team,
    owner: unit,
    radius: unit.hero.role === 'Artillery' ? 8 : 5,
    color: unit.hero.color
  });
  unit.fireCooldown = unit.fireRate;
}

function useTactical(match, unit) {
  unit.tacticalCooldown = 8;
  if (unit.hero.role === 'Support') {
    for (const ally of match.units.filter((u)=>u.team===unit.team && u.respawn<=0 && Math.hypot(u.x-unit.x,u.y-unit.y)<110)) {
      ally.hp = Math.min(ally.maxHp, ally.hp + 16);
      unit.healing += 16;
    }
    match.eventText = `${unit.hero.name} triggered a rescue tempo burst.`;
  } else if (unit.hero.role === 'Controller' || unit.hero.role === 'Disruptor') {
    match.fields.push({ x: unit.x + unit.aimX*40, y: unit.y + unit.aimY*40, radius: 38, life: 4, team: unit.team, kind: 'slow', color: unit.hero.color });
    match.eventText = `${unit.hero.name} locked a lane with tactical control.`;
  } else {
    unit.x = clamp(unit.x + unit.aimX * 42, 36, 884);
    unit.y = clamp(unit.y + unit.aimY * 42, 36, 504);
    match.eventText = `${unit.hero.name} used a tactical reposition.`;
  }
}

function useUltimate(match, unit) {
  unit.ultimateCharge = 0;
  unit.ultimateCooldown = 18;
  const enemies = match.units.filter((u)=>u.team!==unit.team && u.respawn<=0);
  for (const enemy of enemies) {
    const dist = Math.hypot(enemy.x-unit.x, enemy.y-unit.y);
    if (dist < 128) hitUnit(match, enemy, unit.damage * 1.8, unit);
  }
  match.fields.push({ x: unit.x, y: unit.y, radius: 68, life: 2.5, team: unit.team, kind: 'ultimate', color: unit.hero.color });
  match.eventText = `${unit.hero.name} unleashed ${unit.hero.abilities[2].split(':')[0]}.`;
}

function hitUnit(match, target, damage, owner) {
  target.hp -= damage;
  owner.damageDone += damage;
  owner.ultimateCharge = Math.min(100, owner.ultimateCharge + damage * 0.45);
  if (target.hp <= 0) {
    target.deaths += 1;
    owner.eliminations += 1;
    if (match.mode === 'Crystal Relay' && target.shards > 0) {
      for (let i=0;i<target.shards;i++) match.crystals.push({ x: target.x + Math.random()*18-9, y: target.y + Math.random()*18-9, life: 9 });
      target.shards = 0;
    }
    target.respawn = match.mode === 'Knockout Protocol' ? 999 : 4;
    target.hp = 0;
    match.killfeed.unshift(`${owner.hero.name} eliminated ${target.hero.name}`);
    match.killfeed = match.killfeed.slice(0, 4);
    if (match.mode === 'Knockout Protocol') {
      const aliveA = match.units.filter((u)=>u.team==='A' && u.respawn<=0).length;
      const aliveB = match.units.filter((u)=>u.team==='B' && u.respawn<=0).length;
      if (aliveA === 0 || aliveB === 0) {
        const winner = aliveA > 0 ? 'A' : 'B';
        match.roundWins[winner] += 1;
        match.eventText = `Team ${winner} claimed round ${match.round}.`;
        if (match.roundWins[winner] >= 3) match.over = true;
        else resetRound(match);
      }
    }
  }
}

function respawnUnit(unit) {
  unit.hp = unit.maxHp;
  unit.x = unit.team === 'A' ? 120 : 800;
  unit.y = 180 + Math.random() * 180;
}

function resetRound(match) {
  match.round += 1;
  for (const unit of match.units) {
    unit.respawn = 0;
    unit.hp = unit.maxHp;
    unit.shards = 0;
    unit.x = unit.team === 'A' ? 140 : 780;
    unit.y = unit.team === 'A' ? 180 + Math.random()*160 : 180 + Math.random()*160;
  }
  match.objective.ring = 0;
  match.projectiles = [];
  match.fields = [];
}

function updateZoneMode(match, dt) {
  match.objective.rotateTimer -= dt;
  if (match.objective.rotateTimer <= 0) {
    match.objective.rotateTimer = 20;
    match.objective.activeZone = (match.objective.activeZone + 1) % 3;
    const positions = [{x:460,y:270},{x:360,y:200},{x:560,y:340}][match.objective.activeZone];
    match.objective.x = positions.x; match.objective.y = positions.y;
    match.eventText = 'Sector rotated — reposition now.';
  }
  const teamA = match.units.filter((u)=>u.team==='A' && u.respawn<=0 && Math.hypot(u.x-match.objective.x,u.y-match.objective.y)<match.objective.radius).length;
  const teamB = match.units.filter((u)=>u.team==='B' && u.respawn<=0 && Math.hypot(u.x-match.objective.x,u.y-match.objective.y)<match.objective.radius).length;
  if (teamA > 0 && teamB === 0) match.score.A = Math.min(100, match.score.A + dt * 10);
  if (teamB > 0 && teamA === 0) match.score.B = Math.min(100, match.score.B + dt * 10);
  if (match.score.A >= 100 || match.score.B >= 100) match.over = true;
}

function updateCrystalMode(match, dt) {
  if (Math.random() < dt * 1.6 && match.crystals.length < 9) match.crystals.push({ x: 460 + Math.random()*50-25, y: 270 + Math.random()*50-25, life: 8 });
  for (const crystal of match.crystals) crystal.life -= dt;
  match.crystals = match.crystals.filter((c)=>c.life>0);
  for (const unit of match.units.filter((u)=>u.respawn<=0)) {
    for (const crystal of [...match.crystals]) {
      if (Math.hypot(unit.x-crystal.x,unit.y-crystal.y) < 18) {
        unit.shards += 1;
        match.crystals.splice(match.crystals.indexOf(crystal),1);
      }
    }
  }
  const carriedA = match.units.filter((u)=>u.team==='A').reduce((sum,u)=>sum+u.shards,0);
  const carriedB = match.units.filter((u)=>u.team==='B').reduce((sum,u)=>sum+u.shards,0);
  if (carriedA >= 8) match.crystalHold.A += dt;
  else match.crystalHold.A = Math.max(0, match.crystalHold.A - dt*0.5);
  if (carriedB >= 8) match.crystalHold.B += dt;
  else match.crystalHold.B = Math.max(0, match.crystalHold.B - dt*0.5);
  if (match.crystalHold.A >= 15 || match.crystalHold.B >= 15) match.over = true;
}

function updateKnockoutMode(match, dt) {
  if (match.time < 158) match.objective.ring = Math.min(180, match.objective.ring + dt * 10);
  for (const unit of match.units.filter((u)=>u.respawn<=0)) {
    const dist = Math.hypot(unit.x-460, unit.y-270);
    if (dist > 240 - match.objective.ring) unit.hp -= dt * 6;
  }
}

function renderMatch(match, canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawArena(ctx, match);
  for (const field of match.fields) {
    ctx.beginPath();
    ctx.arc(field.x, field.y, field.radius, 0, Math.PI*2);
    ctx.strokeStyle = `${field.color}aa`;
    ctx.lineWidth = field.kind === 'ultimate' ? 4 : 2;
    ctx.stroke();
  }
  for (const crystal of match.crystals) {
    ctx.fillStyle = '#8df5ff';
    ctx.beginPath();
    ctx.moveTo(crystal.x, crystal.y - 8);
    ctx.lineTo(crystal.x + 7, crystal.y);
    ctx.lineTo(crystal.x, crystal.y + 8);
    ctx.lineTo(crystal.x - 7, crystal.y);
    ctx.closePath();
    ctx.fill();
  }
  for (const projectile of match.projectiles) {
    ctx.fillStyle = projectile.color;
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI*2);
    ctx.fill();
  }
  for (const unit of match.units) drawUnit(ctx, unit);
  drawHud(ctx, match);
}

function drawArena(ctx, match) {
  const grad = ctx.createLinearGradient(0,0,920,540);
  grad.addColorStop(0,'#0f1729');
  grad.addColorStop(1,'#1b2340');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,920,540);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  for (let x=40;x<920;x+=80) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,540); ctx.stroke(); }
  for (let y=30;y<540;y+=60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(920,y); ctx.stroke(); }
  ctx.fillStyle = '#1e2947';
  [[220,160,40,120],[660,160,40,120],[430,90,60,40],[430,410,60,40]].forEach(([x,y,w,h])=>ctx.fillRect(x,y,w,h));
  ctx.beginPath();
  if (match.mode === 'Zone Control') {
    ctx.arc(match.objective.x, match.objective.y, match.objective.radius, 0, Math.PI*2);
    ctx.strokeStyle = '#7ae7ff';
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  if (match.mode === 'Crystal Relay') {
    ctx.arc(460,270,48,0,Math.PI*2);
    ctx.strokeStyle = '#7ae7ff';
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  if (match.mode === 'Knockout Protocol') {
    ctx.beginPath();
    ctx.arc(460,270,240-match.objective.ring,0,Math.PI*2);
    ctx.strokeStyle = '#ff6b7a';
    ctx.lineWidth = 5;
    ctx.stroke();
  }
}

function drawUnit(ctx, unit) {
  if (unit.respawn > 0) return;
  ctx.save();
  ctx.translate(unit.x, unit.y);
  const angle = Math.atan2(unit.aimY, unit.aimX);
  ctx.rotate(angle);
  ctx.fillStyle = unit.team === 'A' ? '#ff8b6a' : '#8e74ff';
  ctx.beginPath();
  ctx.roundRect(-14,-12,28,24,10);
  ctx.fill();
  ctx.fillStyle = unit.hero.color;
  ctx.fillRect(2,-3,14,6);
  ctx.restore();
  ctx.fillStyle = '#09101f';
  ctx.fillRect(unit.x - 18, unit.y - 24, 36, 5);
  ctx.fillStyle = '#62f6c8';
  ctx.fillRect(unit.x - 18, unit.y - 24, 36 * (unit.hp / unit.maxHp), 5);
  if (unit.shards > 0) {
    ctx.fillStyle = '#8df5ff';
    ctx.font = '12px Space Grotesk';
    ctx.fillText(`◆${unit.shards}`, unit.x - 10, unit.y - 30);
  }
}

function drawHud(ctx, match) {
  ctx.fillStyle = 'rgba(5,10,20,0.72)';
  ctx.fillRect(20,16,880,58);
  ctx.fillStyle = '#f4f7ff';
  ctx.font = '700 22px Sora';
  ctx.fillText(match.mode, 34, 40);
  ctx.font = '500 13px Space Grotesk';
  ctx.fillStyle = '#9fb2d6';
  ctx.fillText(match.map, 34, 59);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ff8b6a';
  ctx.font = '700 28px Sora';
  const left = match.mode === 'Crystal Relay' ? Math.floor(match.crystalHold.A) : match.mode === 'Knockout Protocol' ? match.roundWins.A : Math.floor(match.score.A);
  const right = match.mode === 'Crystal Relay' ? Math.floor(match.crystalHold.B) : match.mode === 'Knockout Protocol' ? match.roundWins.B : Math.floor(match.score.B);
  ctx.fillText(left, 380, 50);
  ctx.fillStyle = '#8e74ff';
  ctx.fillText(right, 540, 50);
  ctx.fillStyle = '#f4f7ff';
  ctx.fillText(`${Math.ceil(match.time)}`, 460, 50);
  ctx.textAlign = 'left';
  ctx.font = '500 13px Space Grotesk';
  ctx.fillStyle = '#c6d0e6';
  ctx.fillText(match.eventText, 620, 50);
  if (match.over) {
    ctx.fillStyle = 'rgba(7,12,23,0.84)';
    ctx.fillRect(240,160,440,180);
    ctx.strokeStyle = '#ffffff33';
    ctx.strokeRect(240,160,440,180);
    const teamAVal = match.mode === 'Crystal Relay' ? match.crystalHold.A : match.mode === 'Knockout Protocol' ? match.roundWins.A : match.score.A;
    const teamBVal = match.mode === 'Crystal Relay' ? match.crystalHold.B : match.mode === 'Knockout Protocol' ? match.roundWins.B : match.score.B;
    const victory = teamAVal >= teamBVal ? 'Victory' : 'Defeat';
    ctx.fillStyle = teamAVal >= teamBVal ? '#6af0c4' : '#ff8b6a';
    ctx.font = '800 42px Sora';
    ctx.fillText(victory, 370, 235);
    ctx.fillStyle = '#f4f7ff';
    ctx.font = '500 16px Space Grotesk';
    ctx.fillText('Return to Command Deck from the top-right button to queue another scrim.', 292, 280);
  }
}

function updateLiveSummary() {
  const panel = document.querySelector('#liveSummary');
  if (!panel || !state.match) return;
  const player = state.match.units.find((u)=>u.isPlayer);
  panel.innerHTML = `
    <div class="stat-pair"><span>Health</span><strong>${Math.max(0, Math.ceil(player.hp))} / ${player.maxHp}</strong></div>
    <div class="stat-pair"><span>Ultimate</span><strong>${Math.floor(player.ultimateCharge)}%</strong></div>
    <div class="stat-pair"><span>Elims / Deaths</span><strong>${player.eliminations} / ${player.deaths}</strong></div>
    <div class="stat-pair"><span>Damage / Healing</span><strong>${Math.floor(player.damageDone)} / ${Math.floor(player.healing)}</strong></div>
    <div class="stat-pair"><span>Kill feed</span><strong>${state.match.killfeed[0] || 'Find the opening pick.'}</strong></div>
  `;
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

render();
