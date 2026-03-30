window.UI = (() => {
  const screens = ['bootScreen','lobbyScreen','panelScreen','versusScreen','gameScreen','resultsScreen'];
  const state = {
    selectedHero:'rook', squad:Heroes.defaultSquad(), coins:820, xp:34, level:7, lastMatch:null
  };

  function setScreen(id){
    screens.forEach(s=>{
      const el = document.getElementById(s);
      el.classList.toggle('active', s===id);
      el.classList.toggle('hidden', s!==id);
    });
  }

  function bootSequence(){
    let p = 0;
    const timer = setInterval(()=>{
      p += 9 + Math.random()*8;
      document.getElementById('loadingBar').style.width = `${Math.min(100,p)}%`;
      if (p >= 100){ clearInterval(timer); setTimeout(()=>{ setScreen('lobbyScreen'); renderLobby(); }, 260); }
    }, 110);
  }

  function renderLobby(){
    const h = Heroes.byId(state.selectedHero);
    document.getElementById('featuredHero').innerHTML = `<div><h2>${h.name}</h2><p>${h.role} · ${h.weapon}</p><p>${h.desc}</p></div>`;
    document.getElementById('coins').textContent = state.coins;
    document.getElementById('playerLevel').textContent = state.level;
    document.getElementById('xpFill').style.width = `${state.xp}%`;
  }

  function openPanel(type){
    setScreen('panelScreen');
    const title = document.getElementById('panelTitle');
    const content = document.getElementById('panelContent');
    if (type==='heroes') {
      title.textContent = 'Heroes';
      content.innerHTML = `<div class='card-grid'>${HEROES.map(h=>`
        <button class='hero-card' data-hero='${h.id}' style='border-color:${h.color}55'>
          <h3>${h.name}</h3><small>${h.role} · ${h.weapon}</small>
          <p>${h.desc}</p>
          <small>HP ${h.hp} · SPD ${h.speed} · ABILITY ${h.ability}</small>
        </button>`).join('')}</div>`;
      content.querySelectorAll('[data-hero]').forEach(btn=>btn.onclick=()=>{ state.selectedHero=btn.dataset.hero; AudioSys.uiTap(); renderLobby(); });
    } else if (type==='squad') {
      title.textContent = 'Squad';
      content.innerHTML = `<div class='simple-card'><h3>Preferred Lineup</h3><p>Tap to assign first three slots.</p><div class='card-grid'>${HEROES.map(h=>`<button class='hero-card' data-squad='${h.id}'>${h.name}<br><small>${h.role}</small></button>`).join('')}</div><p>Current: ${state.squad.join(', ')}</p></div>`;
      content.querySelectorAll('[data-squad]').forEach(btn=>btn.onclick=()=>{ if(!state.squad.includes(btn.dataset.squad)){ state.squad.shift(); state.squad.push(btn.dataset.squad);} renderLobby(); openPanel('squad'); });
    } else if (type==='modes') {
      title.textContent = 'Modes';
      content.innerHTML = `<div class='mode-card'><h3>Score Clash</h3><p>First to ${CONFIG.game.scoreLimit} in ${Math.floor(CONFIG.game.matchTime/60)} minutes.</p></div>
        <div class='mode-card locked'><h3>Payload Drift</h3><p>Coming soon</p></div>
        <div class='mode-card locked'><h3>Vault Siege</h3><p>Coming soon</p></div>`;
    } else if (type==='progress') {
      title.textContent = 'Progress';
      content.innerHTML = `<div class='simple-card'><h3>Player Path</h3><p>Level ${state.level} Captain</p><div class='xp-track'><div class='xp-fill' style='width:${state.xp}%'></div></div><p>Hero Tokens and cosmetics coming soon.</p></div>`;
    } else {
      title.textContent = 'Settings';
      content.innerHTML = `<div class='simple-card'><h3>Settings</h3><p>Mobile-first controls enabled.</p><p>SFX: On · Vibration: Off · Graphics: High</p></div>`;
    }
  }

  function showVersusThenMatch(){
    setScreen('versusScreen');
    const ally = [state.selectedHero, ...state.squad.slice(0,2)].map(id=>Heroes.byId(id));
    const enemy = ['bulwark','nova','vanta'].map(id=>Heroes.byId(id));
    document.getElementById('allyTeamCard').innerHTML = `<h3>Pulse Rangers</h3>${ally.map(h=>`<p>${h.name} · ${h.role}</p>`).join('')}`;
    document.getElementById('enemyTeamCard').innerHTML = `<h3>Crimson Forge</h3>${enemy.map(h=>`<p>${h.name} · ${h.role}</p>`).join('')}`;
    setTimeout(()=>{ setScreen('gameScreen'); Game.start(state.selectedHero, state.squad); }, 1200);
  }

  function updateHud(gs){
    document.getElementById('scoreText').textContent = `Blue ${gs.score.blue} · ${gs.score.red} Red`;
    document.getElementById('timerText').textContent = Utils.fmtTime(gs.timeLeft);
    document.getElementById('heroName').textContent = `${gs.player.name} · ${gs.player.role}`;
    document.getElementById('hpFill').style.width = `${Math.max(0, (gs.player.hp/gs.player.maxHp)*100)}%`;
    const b = document.getElementById('abilityBtn');
    b.classList.toggle('cooldown', gs.player.cooldown>0 || !gs.player.alive);
    b.textContent = gs.player.cooldown>0 ? Math.ceil(gs.player.cooldown) : 'A';
    const resp = document.getElementById('respawnOverlay');
    if (!gs.player.alive) { resp.classList.remove('hidden'); resp.textContent = `Respawning ${Math.ceil(gs.player.respawn)}...`; }
    else resp.classList.add('hidden');
  }

  function showResults(gs){
    const win = gs.score.blue >= gs.score.red;
    setScreen('resultsScreen');
    document.getElementById('resultHeader').textContent = win ? 'Victory' : 'Defeat';
    document.getElementById('resultScore').textContent = `${gs.score.blue} - ${gs.score.red}`;
    document.getElementById('resultStats').textContent = `Elims ${gs.stats.kills} · Deaths ${gs.stats.deaths}`;

    const rewardCoins = CONFIG.progression.baseCoins + gs.stats.kills*8 + (win?35:12);
    const rewardXp = CONFIG.progression.baseXp + gs.stats.kills*5 + (win?20:8);
    animateCount('rewardCoins', rewardCoins);
    animateCount('rewardXp', rewardXp);
    state.coins += rewardCoins;
    state.xp = (state.xp + rewardXp/4) % 100;
    if (state.xp < 20) state.level++;
    document.getElementById('resultXpFill').style.width = `${state.xp}%`;
    if (win) AudioSys.victory(); else AudioSys.defeat();
    renderLobby();
  }

  function animateCount(id, target){
    const el = document.getElementById(id); let v = 0;
    const t = setInterval(()=>{ v += Math.ceil(target/20); if (v>=target){ v=target; clearInterval(t);} el.textContent = v; }, 30);
  }

  return { state, setScreen, bootSequence, renderLobby, openPanel, showVersusThenMatch, updateHud, showResults };
})();
