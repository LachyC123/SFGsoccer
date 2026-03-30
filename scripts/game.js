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
      hp:h.hp, maxHp:h.hp, alive:true, fireCd:0, cooldown:0, respawn:0, input, recoil:0, slow:0, pierce:0, overdrive:0, shield:0, facing:{x:1,y:0} };
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
    state.particles = state.particles.filter(p=>{
      p.t -= dt;
      p.x += (p.vx || 0) * dt;
      p.y += (p.vy || 0) * dt;
      return p.t > 0;
    });
    if (state.camera.shake > 0) state.camera.shake -= dt * 8;

    for (const u of state.units) {
      if (!u.alive) {
        u.respawn -= dt;
        if (u.respawn <= 0) respawn(u);
        continue;
      }
      updateInputs(u);
      u.fireCd -= dt; u.cooldown -= dt; u.overdrive = Math.max(0, u.overdrive-dt); u.slow = Math.max(0, u.slow-dt); u.shield = Math.max(0, u.shield-dt);
      if (u.input.aim.x || u.input.aim.y) u.facing = { x:Utils.lerp(u.facing.x, u.input.aim.x, .28), y:Utils.lerp(u.facing.y, u.input.aim.y, .28) };
      const moveSpeed = u.speed * (u.overdrive>0?1.35:1) * (u.slow>0?.65:1);
      u.vx = u.input.move.x * moveSpeed;
      u.vy = u.input.move.y * moveSpeed;
      moveWithCollision(u, dt);
      if (u.input.shooting && u.fireCd <=0) shoot(u);
      if (u.input.ability && u.cooldown <=0) activateAbility(u);
    }

    for (const p of state.projectiles) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (Math.random() < .45) state.particles.push({ x:p.x, y:p.y, vx:Utils.rand(-25,25), vy:Utils.rand(-25,25), t:.08, size:2, c:p.team==='blue'?'#8df4ff':'#ff9ea8' });
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
        damage:u.damage, life:u.range/u.projectile, splash:u.splash||0, pierce:u.pierce>0, color:u.color });
    }
    for (let i=0;i<5;i++) state.particles.push({
      x:u.x+u.input.aim.x*16, y:u.y+u.input.aim.y*16, vx:u.input.aim.x*90+Utils.rand(-60,60), vy:u.input.aim.y*90+Utils.rand(-60,60),
      t:.14, size:2+Math.random()*2.5, c:u.team==='blue' ? '#8af5ff' : '#ff9ca4'
    });
    u.recoil = .08;
  }

  function rotate(v, a){ return {x:v.x*Math.cos(a)-v.y*Math.sin(a), y:v.x*Math.sin(a)+v.y*Math.cos(a)}; }

  function activateAbility(u) {
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
    for (let i=0;i<7;i++) state.particles.push({x:u.x,y:u.y,vx:Utils.rand(-140,140),vy:Utils.rand(-140,140),t:.2,size:2+Math.random()*3,c:'#ecf8ff'});
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
    for (let i=0;i<16;i++) state.particles.push({
      x:u.x, y:u.y, vx:Utils.rand(-180,180), vy:Utils.rand(-180,180), t:.45, size:3+Math.random()*5, c:killerTeam==='blue'?'#87ebff':'#ff8795'
    });
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
    const bgGrad = ctx.createLinearGradient(0,0,0,CONFIG.arena.height);
    bgGrad.addColorStop(0,'#102345');
    bgGrad.addColorStop(.5,'#111b36');
    bgGrad.addColorStop(1,'#181531');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0,0,CONFIG.arena.width,CONFIG.arena.height);

    for (let x=0;x<CONFIG.arena.width;x+=120){
      for (let y=0;y<CONFIG.arena.height;y+=120){
        const d = ((x+y)/120)%2===0;
        ctx.fillStyle = d ? 'rgba(132,170,255,.05)' : 'rgba(18,30,56,.28)';
        ctx.fillRect(x+8,y+8,104,104);
        ctx.strokeStyle = 'rgba(149,207,255,.08)';
        ctx.strokeRect(x+12,y+12,96,96);
      }
    }

    const centerY = CONFIG.arena.height/2;
    ctx.fillStyle = 'rgba(61,245,214,.12)';
    ctx.fillRect(0,centerY-24,CONFIG.arena.width,48);
    for (let x=0;x<CONFIG.arena.width;x+=56){
      ctx.fillStyle = x%112===0 ? 'rgba(255,210,84,.3)' : 'rgba(255,210,84,.14)';
      ctx.fillRect(x,centerY-6,30,12);
    }

    drawSpawnZone(CONFIG.arena.spawns.blue,'#5ec2ff');
    drawSpawnZone(CONFIG.arena.spawns.red,'#ff7f95');
    for (const w of CONFIG.arena.walls) drawWall(w);
  }

  function drawSpawnZone(s,color){
    ctx.save();
    ctx.translate(s.x,s.y);
    for (let i=0;i<3;i++){
      ctx.strokeStyle = `${color}${i===0?'66':'33'}`;
      ctx.lineWidth = 4-i;
      ctx.strokeRect(-90+i*12,-130+i*12,180-i*24,260-i*24);
    }
    ctx.restore();
  }

  function drawWall(w){
    const x = w.x-w.w/2, y = w.y-w.h/2;
    const grad = ctx.createLinearGradient(x,y,x,y+w.h);
    grad.addColorStop(0,'#3e619f');
    grad.addColorStop(1,'#263f6d');
    roundRect(x,y,w.w,w.h,14,grad,'rgba(142,215,255,.4)');
    ctx.fillStyle = 'rgba(19,30,54,.35)';
    ctx.fillRect(x+10,y+12,w.w-20,8);
    for (let i=0;i<w.w;i+=32) {
      ctx.fillStyle = 'rgba(255,200,102,.5)';
      ctx.fillRect(x+i+6,y+w.h/2-2,16,4);
    }
  }

  function roundRect(x,y,w,h,r,fill,stroke){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawUnits(){
    for (const u of state.units) {
      if (!u.alive) continue;
      const bob = Math.sin(state.elapsed*4 + u.x*.01)*2;
      const bodyColor = u.team==='blue' ? u.color : '#ff6f79';
      const outline = u.team==='blue' ? '#bde4ff' : '#ffc5cb';
      const a = Math.atan2(u.facing.y,u.facing.x);

      ctx.save();
      ctx.translate(u.x,u.y);
      ctx.fillStyle = 'rgba(0,0,0,.3)';
      ctx.beginPath(); ctx.ellipse(0,22+bob*.3,22,8,0,0,Math.PI*2); ctx.fill();
      ctx.rotate(a);
      roundRect(-16,-18+bob,32,36,8,bodyColor,outline);
      ctx.fillStyle = 'rgba(255,255,255,.22)';
      ctx.fillRect(-10,-10+bob,20,8);
      ctx.fillStyle = '#0b1a34';
      ctx.fillRect(-8,-5+bob,16,6);
      ctx.fillStyle = '#8bf7ff';
      ctx.fillRect(-6,-3+bob,12,2);
      ctx.fillStyle = '#243e67';
      ctx.fillRect(5,-2+bob,20,6);
      ctx.fillStyle = '#99c7ff';
      ctx.fillRect(20,-1+bob,6,4);
      if (u.role==='Defender' || u.role==='Bruiser') { ctx.fillStyle='rgba(255,255,255,.18)'; ctx.fillRect(-18,-14+bob,4,20); }
      if (u.role==='Sniper') { ctx.fillStyle='rgba(255,103,226,.55)'; ctx.fillRect(26,-2+bob,8,2); }
      ctx.restore();

      ctx.save();
      ctx.translate(u.x,u.y);
      ctx.fillStyle='rgba(0,0,0,.45)';
      ctx.fillRect(-22,26,44,6);
      ctx.fillStyle = u.team==='blue' ? '#4df2d6' : '#ff8d98';
      ctx.fillRect(-22,26,44*(u.hp/u.maxHp),6);
      ctx.restore();
    }
  }

  function drawProjectiles(){
    for (const p of state.projectiles) {
      const tailX = p.x-p.vx*.02, tailY = p.y-p.vy*.02;
      const g = ctx.createLinearGradient(p.x,p.y,tailX,tailY);
      g.addColorStop(0,p.team==='blue' ? '#d2fcff' : '#ffe1e4');
      g.addColorStop(1,p.team==='blue' ? '#54dfff' : '#ff7988');
      ctx.strokeStyle = g;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x-p.vx*.015,p.y-p.vy*.015); ctx.stroke();
      ctx.fillStyle = p.team==='blue' ? '#9bf4ff' : '#ff9fac';
      ctx.beginPath(); ctx.arc(p.x,p.y,2.6,0,Math.PI*2); ctx.fill();
    }
  }

  function drawParticles(){
    for (const p of state.particles){
      ctx.globalAlpha = Math.min(1,p.t*4);
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.size||3,0,Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawFloaters(){
    for (const f of state.floaters){
      ctx.fillStyle='#fff';
      ctx.font='bold 14px sans-serif';
      ctx.globalAlpha = Math.min(1,f.t*2);
      ctx.fillText(f.text, f.x - state.camera.x + CONFIG.game.width/2, f.y - state.camera.y + CONFIG.game.height/2 - (1-f.t)*26);
    }
    ctx.globalAlpha = 1;
  }

  function finishMatch() {
    if (state.over) return;
    state.over = true; state.running = false;
    UI.showResults(state);
  }

  return { start, getState:()=>state };
})();
