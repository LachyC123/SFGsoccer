(() => {
  const screens = {
    splash: document.getElementById('splash'),
    menu: document.getElementById('menu'),
    transition: document.getElementById('transition'),
    game: document.getElementById('game'),
    results: document.getElementById('results')
  };

  const ui = {
    playBtn: document.getElementById('playBtn'),
    againBtn: document.getElementById('againBtn'),
    homeBtn: document.getElementById('homeBtn'),
    loadingFill: document.getElementById('loadingFill'),
    coins: document.getElementById('coins'),
    trophies: document.getElementById('trophies'),
    alive: document.getElementById('aliveCount'),
    time: document.getElementById('timeCount'),
    power: document.getElementById('powerCount'),
    hp: document.getElementById('playerHealth'),
    zoneWarning: document.getElementById('zoneWarning'),
    resultTitle: document.getElementById('resultTitle'),
    rankTxt: document.getElementById('rankTxt'),
    trophyDelta: document.getElementById('trophyDelta'),
    coinDelta: document.getElementById('coinDelta'),
    superBtn: document.getElementById('superBtn'),
    queueLine: document.getElementById('queueLine'),
    resultFlavor: document.getElementById('resultFlavor')
  };

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const world = { w: 2200, h: 2200, center: { x: 1100, y: 1100 } };
  const state = {
    mode: 'boot',
    entities: [],
    projectiles: [],
    effects: [],
    pickups: [],
    walls: [],
    bushes: [],
    player: null,
    timer: 0,
    aliveCount: 0,
    zoneRadius: 1050,
    zoneMin: 190,
    zoneShrinkRate: 5,
    superCharge: 0,
    currencies: { coins: 120, trophies: 50 },
    queueLines: [
      'Checking nearby skill buckets and ping quality...',
      'Calibrating lobby balance for a fair opener...',
      'One player is swapping loadout, almost ready...',
      'Server warmup in progress — syncing arena hazards...'
    ],
    resultLines: {
      victory: [
        'Great spacing. You forced every fight on your terms.',
        'Calm finish. You played the edge perfectly.',
        'Clinical endgame. Clean peeks, clean closes.'
      ],
      defeat: [
        'Tough loss, but the rotations were improving.',
        'Close one. You were one pickup from turning it.',
        'Shaky midgame, strong finish. Queue it back up.'
      ]
    }
  };

  const controls = {
    move: { active: false, baseX: 0, baseY: 0, x: 0, y: 0, vx: 0, vy: 0 },
    aim: { active: false, baseX: 0, baseY: 0, x: 0, y: 0, vx: 0, vy: 0, firing: false }
  };

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    state.mode = name;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function buildArena() {
    state.walls = [];
    state.bushes = [];
    const addWall = (x, y, w, h) => state.walls.push({ x, y, w, h });
    const addBush = (x, y, r) => state.bushes.push({ x, y, r });

    for (let i = 0; i < 6; i++) {
      const off = 250 + i * 320;
      addWall(off, 310, 170, 42);
      addWall(off, 1848, 170, 42);
      addWall(310, off, 42, 170);
      addWall(1848, off, 42, 170);
    }

    [[620, 620], [1580, 620], [620, 1580], [1580, 1580], [1090, 760], [1090, 1400], [760, 1090], [1400, 1090]].forEach(([x, y]) => {
      addWall(x - 95, y - 25, 190, 50);
      addWall(x - 25, y - 95, 50, 190);
    });

    for (let i = 0; i < 20; i++) {
      const a = (Math.PI * 2 * i) / 20;
      addBush(1100 + Math.cos(a) * 760, 1100 + Math.sin(a) * 760, 44 + (i % 2) * 8);
    }
  }

  function spawnMatch() {
    state.entities = [];
    state.projectiles = [];
    state.effects = [];
    state.pickups = [];
    state.timer = 0;
    state.zoneRadius = 1050;
    state.superCharge = 0;

    buildArena();

    const spawn = (isPlayer, name, x, y, color) => ({
      id: Math.random(),
      isPlayer,
      name,
      x, y,
      vx: 0, vy: 0,
      hp: 100,
      maxHp: 100,
      speed: isPlayer ? 165 : 140 + Math.random() * 25,
      rad: 24,
      power: 0,
      ai: { tx: x, ty: y, fireCd: 0, panic: false, roam: 0 },
      fireCd: 0,
      color,
      superCd: 0,
      alive: true
    });

    const player = spawn(true, 'Mara', 1100, 260, '#8cb6dc');
    state.player = player;
    state.entities.push(player);

    for (let i = 0; i < 9; i++) {
      const angle = (Math.PI * 2 * i) / 9;
      const r = 830;
      const names = ['Kite', 'Rowan', 'Pax', 'Juno', 'Brass', 'Nell', 'Ivo', 'Koda', 'Sable'];
      state.entities.push(spawn(false, names[i], 1100 + Math.cos(angle) * r, 1100 + Math.sin(angle) * r, `hsl(${25 + i * 17},48%,62%)`));
    }

    for (let i = 0; i < 15; i++) {
      state.pickups.push({ x: 250 + Math.random() * 1700, y: 250 + Math.random() * 1700, rad: 16, t: Math.random() * 5 });
    }

    showScreen('game');
  }

  function collideWall(e) {
    for (const w of state.walls) {
      const nx = Math.max(w.x, Math.min(e.x, w.x + w.w));
      const ny = Math.max(w.y, Math.min(e.y, w.y + w.h));
      const dx = e.x - nx, dy = e.y - ny;
      const d = Math.hypot(dx, dy);
      if (d < e.rad) {
        const push = e.rad - d || 1;
        e.x += (dx / (d || 1)) * push;
        e.y += (dy / (d || 1)) * push;
      }
    }
    e.x = Math.max(e.rad, Math.min(world.w - e.rad, e.x));
    e.y = Math.max(e.rad, Math.min(world.h - e.rad, e.y));
  }

  function fire(from, ax, ay, speed = 420, dmg = 16, spread = 0.13) {
    const n = Math.hypot(ax, ay) || 1;
    const dir = Math.atan2(ay, ax) + (Math.random() - 0.5) * spread;
    state.projectiles.push({
      owner: from.id,
      x: from.x,
      y: from.y,
      vx: Math.cos(dir) * speed,
      vy: Math.sin(dir) * speed,
      dmg,
      life: 1.2,
      r: 7,
      c: from.isPlayer ? '#8dffff' : '#ff9a7e'
    });
    state.effects.push({ type: 'muzzle', x: from.x, y: from.y, t: 0.14 });
  }

  function aiTick(bot, dt) {
    const enemies = state.entities.filter(e => e.alive && e.id !== bot.id);
    const nearest = enemies.sort((a, b) => (a.x - bot.x) ** 2 + (a.y - bot.y) ** 2 - ((b.x - bot.x) ** 2 + (b.y - bot.y) ** 2))[0];
    const low = bot.hp < 32;

    bot.ai.roam -= dt;
    if (bot.ai.roam <= 0 || !nearest) {
      bot.ai.roam = 1.8 + Math.random() * 1.8;
      const pick = state.pickups[Math.floor(Math.random() * state.pickups.length)];
      bot.ai.tx = pick ? pick.x : (260 + Math.random() * 1680);
      bot.ai.ty = pick ? pick.y : (260 + Math.random() * 1680);
    }

    if (nearest) {
      const dx = nearest.x - bot.x, dy = nearest.y - bot.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 360 && !low) {
        bot.ai.tx = nearest.x - dx * 0.35;
        bot.ai.ty = nearest.y - dy * 0.35;
        if (bot.fireCd <= 0) {
          fire(bot, dx, dy, 390, 10 + bot.power * 2, 0.22);
          bot.fireCd = 0.38 + Math.random() * 0.45;
        }
      } else if (low && dist < 280) {
        bot.ai.tx = bot.x - dx;
        bot.ai.ty = bot.y - dy;
      }
    }

    const mvx = bot.ai.tx - bot.x, mvy = bot.ai.ty - bot.y;
    const len = Math.hypot(mvx, mvy) || 1;
    bot.vx = (mvx / len) * bot.speed * (low ? 1.1 : 1);
    bot.vy = (mvy / len) * bot.speed * (low ? 1.1 : 1);
  }

  function update(dt) {
    state.timer += dt;
    ui.time.textContent = state.timer.toFixed(0);

    state.zoneRadius = Math.max(state.zoneMin, state.zoneRadius - state.zoneShrinkRate * dt);
    ui.zoneWarning.style.opacity = state.zoneRadius < 550 ? 1 : 0;

    for (const e of state.entities) {
      if (!e.alive) continue;
      if (!e.isPlayer) aiTick(e, dt);

      if (e.isPlayer) {
        e.vx = controls.move.vx * e.speed;
        e.vy = controls.move.vy * e.speed;

        if (controls.aim.firing && e.fireCd <= 0) {
          fire(e, controls.aim.vx || 1, controls.aim.vy || 0, 480, 14 + e.power * 2, 0.1);
          e.fireCd = 0.18;
          state.superCharge = Math.min(100, state.superCharge + 1.7);
        }
      }

      e.fireCd -= dt;
      e.superCd -= dt;
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      collideWall(e);

      const zx = e.x - world.center.x, zy = e.y - world.center.y;
      const zd = Math.hypot(zx, zy);
      if (zd > state.zoneRadius) e.hp -= 12 * dt;

      for (let i = state.pickups.length - 1; i >= 0; i--) {
        const p = state.pickups[i];
        const d = Math.hypot(e.x - p.x, e.y - p.y);
        if (d < e.rad + p.rad) {
          e.power += 1;
          e.maxHp += 8;
          e.hp = Math.min(e.maxHp, e.hp + 18);
          state.pickups.splice(i, 1);
          state.effects.push({ type: 'burst', x: p.x, y: p.y, t: 0.35, c: '#7dff9b' });
        }
      }

      if (e.hp <= 0) {
        e.alive = false;
        state.effects.push({ type: 'burst', x: e.x, y: e.y, t: 0.55, c: '#ffec83' });
      }
    }

    for (let i = state.projectiles.length - 1; i >= 0; i--) {
      const p = state.projectiles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      let hit = false;
      for (const w of state.walls) {
        if (p.x > w.x && p.x < w.x + w.w && p.y > w.y && p.y < w.y + w.h) {
          hit = true;
          state.effects.push({ type: 'spark', x: p.x, y: p.y, t: 0.2, c: '#ffe8a0' });
          break;
        }
      }

      for (const e of state.entities) {
        if (!e.alive || e.id === p.owner) continue;
        const d = Math.hypot(p.x - e.x, p.y - e.y);
        if (d < e.rad + p.r) {
          e.hp -= p.dmg;
          hit = true;
          state.effects.push({ type: 'spark', x: p.x, y: p.y, t: 0.24, c: '#ffb37b' });
          if (p.owner === state.player.id) state.superCharge = Math.min(100, state.superCharge + 3);
          break;
        }
      }

      if (hit || p.life <= 0) state.projectiles.splice(i, 1);
    }

    for (let i = state.effects.length - 1; i >= 0; i--) {
      state.effects[i].t -= dt;
      if (state.effects[i].t <= 0) state.effects.splice(i, 1);
    }

    if (Math.random() < dt * 0.55 && state.pickups.length < 18) {
      state.pickups.push({ x: 180 + Math.random() * 1840, y: 180 + Math.random() * 1840, rad: 16, t: 0 });
    }

    state.aliveCount = state.entities.filter(e => e.alive).length;
    ui.alive.textContent = state.aliveCount;
    ui.power.textContent = state.player.power;
    ui.hp.style.width = `${Math.max(0, (state.player.hp / state.player.maxHp) * 100)}%`;
    ui.superBtn.classList.toggle('ready', state.superCharge >= 100);

    if (!state.player.alive || state.aliveCount <= 1) endMatch();
  }

  function render() {
    const camX = state.player.x - window.innerWidth / 2;
    const camY = state.player.y - window.innerHeight / 2;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = '#8f775f';
    ctx.fillRect(-camX, -camY, world.w, world.h);

    ctx.strokeStyle = 'rgba(255,255,255,.07)';
    for (let gx = 0; gx < world.w; gx += 72) {
      ctx.beginPath(); ctx.moveTo(gx - camX, -camY); ctx.lineTo(gx - camX, world.h - camY); ctx.stroke();
    }

    for (const b of state.bushes) {
      ctx.fillStyle = '#486e3f';
      ctx.beginPath(); ctx.arc(b.x - camX, b.y - camY, b.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#618f55';
      ctx.beginPath(); ctx.arc(b.x - camX + 8, b.y - camY - 4, b.r * 0.5, 0, Math.PI * 2); ctx.fill();
    }

    ctx.fillStyle = '#5f6f89';
    for (const w of state.walls) ctx.fillRect(w.x - camX, w.y - camY, w.w, w.h);

    for (const p of state.pickups) {
      p.t += 0.05;
      const bob = Math.sin(p.t * 3) * 3;
      ctx.fillStyle = '#57ff92';
      ctx.beginPath(); ctx.arc(p.x - camX, p.y - camY + bob, p.rad, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillRect(p.x - camX - 3, p.y - camY - 6 + bob, 6, 12);
      ctx.fillRect(p.x - camX - 6, p.y - camY - 3 + bob, 12, 6);
    }

    for (const e of state.entities) {
      if (!e.alive) continue;
      ctx.fillStyle = e.color;
      ctx.beginPath(); ctx.arc(e.x - camX, e.y - camY, e.rad, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#101010';
      ctx.beginPath(); ctx.arc(e.x - camX + 5, e.y - camY - 6, 4, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#1f2639'; ctx.fillRect(e.x - camX - 28, e.y - camY - 40, 56, 7);
      ctx.fillStyle = '#65ff7f'; ctx.fillRect(e.x - camX - 28, e.y - camY - 40, 56 * (e.hp / e.maxHp), 7);
    }

    for (const p of state.projectiles) {
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x - camX, p.y - camY, p.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.55)';
      ctx.beginPath(); ctx.arc(p.x - camX - 2, p.y - camY - 2, p.r * 0.45, 0, Math.PI * 2); ctx.fill();
    }

    for (const fx of state.effects) {
      const prog = Math.max(0, fx.t);
      if (fx.type === 'spark') {
        ctx.strokeStyle = fx.c; ctx.lineWidth = 3;
        for (let i = 0; i < 5; i++) {
          const a = (Math.PI * 2 * i) / 5 + prog * 8;
          ctx.beginPath();
          ctx.moveTo(fx.x - camX, fx.y - camY);
          ctx.lineTo(fx.x - camX + Math.cos(a) * 18 * (1 - prog), fx.y - camY + Math.sin(a) * 18 * (1 - prog));
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = fx.c || '#9fd5ff';
        ctx.globalAlpha = Math.max(0, prog * 2);
        ctx.beginPath(); ctx.arc(fx.x - camX, fx.y - camY, 46 * (1 - prog), 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    ctx.strokeStyle = 'rgba(255,84,111,.85)';
    ctx.lineWidth = 30;
    ctx.beginPath(); ctx.arc(world.center.x - camX, world.center.y - camY, state.zoneRadius, 0, Math.PI * 2); ctx.stroke();
  }

  function endMatch() {
    const alive = state.entities.filter(e => e.alive);
    const playerWon = state.player.alive && alive.length === 1;
    const rank = state.entities.filter(e => !e.alive).length + (state.player.alive ? 1 : 0);
    const trophyDelta = playerWon ? 8 : (rank >= 6 ? 2 : -4);
    const coinDelta = Math.max(8, (11 - rank) * 3 + state.player.power * 2);

    state.currencies.trophies += trophyDelta;
    state.currencies.coins += coinDelta;
    ui.trophies.textContent = state.currencies.trophies;
    ui.coins.textContent = state.currencies.coins;

    ui.resultTitle.textContent = playerWon ? 'Victory' : 'Defeat';
    const flavorPool = playerWon ? state.resultLines.victory : state.resultLines.defeat;
    ui.resultFlavor.textContent = flavorPool[Math.floor(Math.random() * flavorPool.length)];
    ui.rankTxt.textContent = `#${11 - rank}`;
    ui.trophyDelta.textContent = `${trophyDelta >= 0 ? '+' : ''}${trophyDelta}`;
    ui.coinDelta.textContent = `+${coinDelta}`;

    showScreen('results');
  }

  function loop(ts) {
    if (!loop.last) loop.last = ts;
    const dt = Math.min(0.033, (ts - loop.last) / 1000);
    loop.last = ts;

    if (state.mode === 'game') {
      update(dt);
      render();
    }
    requestAnimationFrame(loop);
  }

  function attachPad(pad, stick, target) {
    const start = (e) => {
      const t = e.changedTouches ? e.changedTouches[0] : e;
      target.active = true;
      target.baseX = t.clientX;
      target.baseY = t.clientY;
      target.x = t.clientX;
      target.y = t.clientY;
      if (target === controls.aim) controls.aim.firing = true;
    };
    const move = (e) => {
      if (!target.active) return;
      const t = e.changedTouches ? e.changedTouches[0] : e;
      target.x = t.clientX;
      target.y = t.clientY;
      const dx = target.x - target.baseX;
      const dy = target.y - target.baseY;
      const len = Math.hypot(dx, dy);
      const max = 34;
      const sx = len > max ? (dx / len) * max : dx;
      const sy = len > max ? (dy / len) * max : dy;
      stick.style.transform = `translate(${sx}px, ${sy}px)`;
      target.vx = sx / max;
      target.vy = sy / max;
    };
    const end = () => {
      target.active = false;
      target.vx = 0; target.vy = 0;
      if (target === controls.aim) controls.aim.firing = false;
      stick.style.transform = 'translate(0,0)';
    };

    pad.addEventListener('touchstart', (e) => { e.preventDefault(); start(e); }, { passive: false });
    pad.addEventListener('touchmove', (e) => { e.preventDefault(); move(e); }, { passive: false });
    pad.addEventListener('touchend', (e) => { e.preventDefault(); end(); }, { passive: false });
    pad.addEventListener('pointerdown', start);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
  }

  function useSuper() {
    if (state.mode !== 'game' || state.superCharge < 100 || state.player.superCd > 0) return;
    state.superCharge = 0;
    state.player.superCd = 6;
    for (let i = 0; i < 22; i++) {
      const a = (Math.PI * 2 * i) / 22;
      fire(state.player, Math.cos(a), Math.sin(a), 460, 18 + state.player.power * 2, 0);
    }
    state.effects.push({ type: 'burst', x: state.player.x, y: state.player.y, t: 0.45, c: '#8ff6ff' });
  }

  ui.playBtn.addEventListener('click', () => {
    showScreen('transition');
    let p = 0;
    const int = setInterval(() => {
      p += 18;
      ui.loadingFill.style.width = `${Math.min(100, p)}%`;
      if (Math.random() < 0.35) {
        ui.queueLine.textContent = state.queueLines[Math.floor(Math.random() * state.queueLines.length)];
      }
      if (p >= 100) {
        clearInterval(int);
        ui.loadingFill.style.width = '0%';
        spawnMatch();
      }
    }, 140);
  });

  ui.againBtn.addEventListener('click', () => {
    showScreen('transition');
    setTimeout(spawnMatch, 850);
  });
  ui.homeBtn.addEventListener('click', () => showScreen('menu'));
  ui.superBtn.addEventListener('click', useSuper);

  document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

  attachPad(document.getElementById('movePad'), document.getElementById('moveStick'), controls.move);
  attachPad(document.getElementById('attackPad'), document.getElementById('attackStick'), controls.aim);

  resize();
  window.addEventListener('resize', resize);

  showScreen('splash');
  setTimeout(() => showScreen('menu'), 1250);
  requestAnimationFrame(loop);
})();
