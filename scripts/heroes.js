window.HEROES = [
  { id:'rook', name:'Rook', role:'Assault', color:'#7ab5ff', weapon:'Pulse Rifle', desc:'Balanced striker with burst pressure.', hp:130, speed:215, fireRate:.18, damage:15, projectile:540, spread:.08, range:550, ability:'burstDash', cooldown:7 },
  { id:'zeph', name:'Zeph', role:'Flanker', color:'#36f5d5', weapon:'Volt SMG', desc:'Hyper-mobile duelist who shreds up close.', hp:105, speed:250, fireRate:.1, damage:8, projectile:630, spread:.18, range:380, ability:'speedSurge', cooldown:9 },
  { id:'bulwark', name:'Bulwark', role:'Defender', color:'#8f95ff', weapon:'Arc Mortar', desc:'Area denial tank with explosive shells.', hp:185, speed:175, fireRate:.62, damage:28, projectile:390, spread:.05, splash:70, range:600, ability:'shieldPulse', cooldown:12 },
  { id:'vanta', name:'Vanta', role:'Sniper', color:'#ff67e2', weapon:'Needle Rail', desc:'Long-range precision picks.', hp:95, speed:205, fireRate:.75, damage:43, projectile:790, spread:.01, range:900, ability:'pierceRound', cooldown:10 },
  { id:'solace', name:'Solace', role:'Support', color:'#f7d66b', weapon:'Beam Pistol', desc:'Sustains allies and chips enemies.', hp:118, speed:210, fireRate:.2, damage:11, projectile:500, spread:.06, range:500, ability:'healingBurst', cooldown:11 },
  { id:'knell', name:'Knell', role:'Bruiser', color:'#ff8e65', weapon:'Scatter Cannon', desc:'Close quarter bully with heavy knock.', hp:170, speed:195, fireRate:.56, damage:12, pellets:6, projectile:470, spread:.44, range:280, ability:'slamDash', cooldown:9 },
  { id:'glitch', name:'Glitch', role:'Controller', color:'#95f17a', weapon:'Disruptor', desc:'Slows zones and controls mid.', hp:125, speed:205, fireRate:.3, damage:13, projectile:450, spread:.07, range:520, ability:'slowField', cooldown:12 },
  { id:'nova', name:'Nova', role:'Assault', color:'#ff6f79', weapon:'Tri Bolt', desc:'Three-round burst with finish power.', hp:132, speed:220, fireRate:.28, burst:3, damage:10, projectile:560, spread:.1, range:560, ability:'overdrive', cooldown:10 }
];

window.Heroes = {
  byId(id) { return HEROES.find(h => h.id === id) || HEROES[0]; },
  defaultSquad() { return ['rook', 'solace', 'zeph']; }
};
