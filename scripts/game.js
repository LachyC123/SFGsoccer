window.Game = (() => {
  const state = {
    running:false, over:false, elapsed:0, timeLeft:CONFIG.game.matchTime,
    score:{blue:0, red:0}, particles:[], projectiles:[], floaters:[], units:[], camera:{x:0,y:0,shake:0},
    player:null, allyRoster:[], enemyRoster:[], stats:{kills:0,deaths:0,assists:0}
  };
  let ctx, canvas, last=0;

  function createUnit(heroId, team, isPlayer=false) {
    const h = Heroes.byId(heroId);
    const spawn = CONFIG.arena.spawns[team];
    const input = {move:{x:0,y:0}, aim:{x:1,y:0}, shooting:false, ability:false};
    return { ...h, team, isPlayer, x:spawn.x+Utils.rand(-70,70), y:spawn.y+Utils.rand(-80,80), vx:0, vy:0,
      hp:h.hp, maxHp:h.hp, alive:true, fireCd:0, cooldown:0, respawn:0, input, recoil:0, slow:0, pierce:0, overdrive:0, shield:0 };
  }

  function start(selectedHero, squad) {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = CONFIG.game.width; canvas.height = CONFIG.game.height;
    state.running = true; state.over = false; state.elapsed=0; state.timeLeft=CONFIG.game.matchTime;
    state.score = {blue:0, red:0}; state.particles=[]; state.projectiles=[]; state.floaters=[]; state.units=[];
    state.stats = {kills:0,deaths:0,assists:0};

    state.player = createUnit(selectedHero,'blue',true);
    state.units.push(state.player);
    const allyPool = [...squad.filter(s=>s!==selectedHero), 'solace','knell'];
    const enemyPool = ['bulwark','nova','vanta','glitch','zeph'];
    for (let i=0;i<CONFIG.game.botCountPerTeam;i++) {
      state.units.push(createUnit(allyPool[i%allyPool.length],'blue'));
      state.units.push(createUnit(enemyPool[i%enemyPool.length],'red'));
    }
    state.allyRoster = state.units.filter(u=>u.team==='blue').map(u=>u.id);
    state.enemyRoster = state.units.filter(u=>u.team==='red').map(u=>u.id);

    Input.init(canvas);
    last = performance.now();
    requestAnimationFrame(loop);
  }

  function loop(t) {
    if (!state.running) return;
    const dt = Math.min(.033, (t-last)/1000); last = t;
    update(dt); render();
    if (!state.over) requestAnimationFrame(loop);
  }

  function update(dt) {
    state.elapsed += dt; state.timeLeft -= dt;
    state.floaters = state.floaters.filter(f=>(f.t-=dt) > 0);
    state.particles = state.particles.filter(p=>(p.t-=dt) > 0);
    if (state.camera.shake > 0) state.camera.shake -= dt * 8;

    for (const u of state.units) {
      if (!u.alive) {
        u.respawn -= dt;
        if (u.respawn <= 0) respawn(u);
        continue;
      }
      updateInputs(u);
      u.fireCd -= dt; u.cooldown -= dt; u.overdrive = Math.max(0, u.overdrive-dt); u.slow = Math.max(0, u.slow-dt); u.shield = Math.max(0, u.shield-dt);
      const moveSpeed = u.speed * (u.overdrive>0?1.35:1) * (u.slow>0?.65:1);
      u.vx = u.input.move.x * moveSpeed;
      u.vy = u.input.move.y * moveSpeed;
      moveWithCollision(u, dt);
      if (u.input.shooting && u.fireCd <=0) shoot(u);
      if (u.input.ability && u.cooldown <=0) activateAbility(u);
    }

    for (const p of state.projectiles) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.life <=0 || p.x<0 || p.x>CONFIG.arena.width || p.y<0 || p.y>CONFIG.arena.height) p.dead = true;
      for (const u of state.units) {
        if (!u.alive || u.team===p.team || Utils.dist(u,p) > 20) continue;
        hitUnit(u,p); if (!p.pierce) p.dead = true;
      }
    }
    state.projectiles = state.projectiles.filter(p=>!p.dead);

    if (state.timeLeft<=0 || state.score.blue>=CONFIG.game.scoreLimit || state.score.red>=CONFIG.game.scoreLimit) finishMatch();
  }

  function updateInputs(u) {
    if (u.isPlayer) {
      const i = Input.get();
      u.input = { move:i.move, aim: i.aim.x||i.aim.y ? i.aim : toWorldAim(u, i.pointer), shooting:i.shooting, ability:Input.consumeAbility() };
    } else {
      BotAI.update(u,state,1/60);
    }
  }

  function toWorldAim(u, pointer) {
    const wx = state.camera.x - CONFIG.game.width/2 + pointer.x;
    const wy = state.camera.y - CONFIG.game.height/2 + pointer.y;
    return Utils.norm(wx-u.x, wy-u.y);
  }

  function shoot(u) {
    u.fireCd = u.fireRate * (u.overdrive>0?.65:1);
    AudioSys.shoot();
    const pellets = u.pellets || 1;
    for (let i=0;i<pellets;i++) {
      const spread = (Math.random()-.5) * u.spread;
      const dir = rotate(u.input.aim, spread);
      state.projectiles.push({ x:u.x+dir.x*22, y:u.y+dir.y*22, vx:dir.x*u.projectile, vy:dir.y*u.projectile, team:u.team,
        damage:u.damage, life:u.range/u.projectile, splash:u.splash||0, pierce:u.pierce>0 });
    }
    u.recoil = .08;
  }

  function rotate(v, a){ return {x:v.x*Math.cos(a)-v.y*Math.sin(a), y:v.x*Math.sin(a)+v.y*Math.cos(a)}; }

  function activateAbility(u) {
    u.cooldown = u.cooldown || 8;
    const m = u.ability;
    if (m==='burstDash' || m==='slamDash') { u.x += u.input.aim.x * 110; u.y += u.input.aim.y*110; state.camera.shake = .6; }
    if (m==='speedSurge') u.overdrive = 2.4;
    if (m==='shieldPulse') u.shield = 3.2;
    if (m==='pierceRound') u.pierce = 2.2;
    if (m==='healingBurst') state.units.filter(a=>a.team===u.team && Utils.dist(a,u)<190).forEach(a=> a.hp = Math.min(a.maxHp, a.hp + 34));
    if (m==='slowField') state.units.filter(e=>e.team!==u.team && Utils.dist(e,u)<180).forEach(e=> e.slow = 2.6);
    if (m==='overdrive') u.overdrive = 3.2;
    u.cooldown = Heroes.byId(u.id).cooldown;
  }

  function hitUnit(u,p) {
    const dmg = u.shield>0 ? p.damage*.45 : p.damage;
    u.hp -= dmg;
    state.floaters.push({x:u.x, y:u.y-22, text:Math.round(dmg), t:.5});
    state.particles.push({x:u.x,y:u.y,t:.22,c:'#fff'});
    AudioSys.hit();
    if (p.splash > 0) splashDamage(u,p);
    if (u.hp <= 0) eliminate(u,p.team);
  }

  function splashDamage(center,p) {
    for (const u of state.units) {
      if (!u.alive || u.team===p.team || u===center) continue;
      const d = Utils.dist(u,center);
      if (d < p.splash) u.hp -= p.damage * (1 - d/p.splash) * .45;
      if (u.hp <=0) eliminate(u,p.team);
    }
  }

  function eliminate(u, killerTeam) {
    u.alive = false; u.respawn = CONFIG.game.respawnTime; u.hp = 0;
    state.score[killerTeam]++;
    state.particles.push({x:u.x,y:u.y,t:.45,c:'#ff9'});
    if (killerTeam==='blue') state.stats.kills++;
    if (u.isPlayer) state.stats.deaths++;
    AudioSys.elim();
  }

  function respawn(u) {
    const s = CONFIG.arena.spawns[u.team];
    u.x = s.x + Utils.rand(-45,45); u.y = s.y + Utils.rand(-55,55);
    u.hp = u.maxHp; u.alive = true;
  }

  function moveWithCollision(u,dt){
    const nx = u.x + u.vx*dt, ny = u.y + u.vy*dt;
    u.x = Utils.clamp(nx, 24, CONFIG.arena.width-24);
    u.y = Utils.clamp(ny, 24, CONFIG.arena.height-24);
    for (const w of CONFIG.arena.walls) {
      if (u.x > w.x-w.w/2-18 && u.x < w.x+w.w/2+18 && u.y > w.y-w.h/2-18 && u.y < w.y+w.h/2+18) {
        u.x -= u.vx*dt; u.y -= u.vy*dt;
      }
    }
  }

  function render() {
    const c = state.camera;
    c.x = Utils.lerp(c.x || state.player.x, state.player.x + (Math.random()-.5)*14*c.shake, .2);
    c.y = Utils.lerp(c.y || state.player.y, state.player.y + (Math.random()-.5)*14*c.shake, .2);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.translate(CONFIG.game.width/2 - c.x, CONFIG.game.height/2 - c.y);
    drawArena();
    drawProjectiles();
    drawUnits();
    drawParticles();
    ctx.restore();
    drawFloaters();
    UI.updateHud(state);
  }

  function drawArena(){
    ctx.fillStyle = '#121f3c'; ctx.fillRect(0,0,CONFIG.arena.width,CONFIG.arena.height);
    ctx.fillStyle = 'rgba(255,255,255,.02)';
    for (let y=0;y<CONFIG.arena.height;y+=80) ctx.fillRect(0,y,CONFIG.arena.width,2);
    for (const w of CONFIG.arena.walls) {
      ctx.fillStyle = '#253f72'; ctx.fillRect(w.x-w.w/2,w.y-w.h/2,w.w,w.h);
      ctx.strokeStyle = 'rgba(122,181,255,.35)'; ctx.strokeRect(w.x-w.w/2,w.y-w.h/2,w.w,w.h);
    }
  }
  function drawUnits(){
    for (const u of state.units) {
      if (!u.alive) continue;
      ctx.save(); ctx.translate(u.x,u.y);
      const bob = Math.sin(state.elapsed*4 + u.x*.01)*2;
      ctx.fillStyle = u.team==='blue'?u.color:'#ff6f79';
      ctx.beginPath(); ctx.arc(0,bob,18,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillRect(-2+bob*.1,-18,4,10);
      ctx.fillStyle='rgba(0,0,0,.35)'; ctx.fillRect(-20,24,40,5);
      ctx.fillStyle = '#1de9b6'; ctx.fillRect(-20,24,40*(u.hp/u.maxHp),5);
      ctx.restore();
    }
  }
  function drawProjectiles(){
    for (const p of state.projectiles) {
      ctx.strokeStyle = p.team==='blue' ? '#7deeff' : '#ff969f';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x-p.vx*.015,p.y-p.vy*.015); ctx.stroke();
    }
  }
  function drawParticles(){ for (const p of state.particles){ ctx.globalAlpha=p.t*3; ctx.fillStyle=p.c; ctx.fillRect(p.x-5,p.y-5,10,10);} ctx.globalAlpha=1; }
  function drawFloaters(){
    for (const f of state.floaters){ ctx.fillStyle='#fff'; ctx.font='bold 14px sans-serif'; ctx.globalAlpha = Math.min(1,f.t*2); ctx.fillText(f.text, f.x - state.camera.x + CONFIG.game.width/2, f.y - state.camera.y + CONFIG.game.height/2 - (1-f.t)*26); }
    ctx.globalAlpha = 1;
  }

  function finishMatch() {
    if (state.over) return;
    state.over = true; state.running = false;
    UI.showResults(state);
  }

  return { start, getState:()=>state };
})();
