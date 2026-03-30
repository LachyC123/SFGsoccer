window.Input = (() => {
  const state = {
    move:{x:0,y:0}, aim:{x:0,y:0}, shooting:false, ability:false, pointer:{x:0,y:0}
  };
  const touches = { move:null, aim:null, moveBase:null, aimBase:null };
  let canvas;

  function init(cvs) {
    canvas = cvs;
    bindTouch('moveStick','move');
    bindTouch('aimStick','aim');
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', offKey);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', ()=> state.shooting = true);
    window.addEventListener('mouseup', ()=> state.shooting = false);
    document.getElementById('abilityBtn').addEventListener('click', ()=> state.ability = true);
  }

  function bindTouch(id, side) {
    const el = document.getElementById(id);
    const knob = el.querySelector('.stick-knob');
    const radius = CONFIG.controls.stickRadius;
    el.addEventListener('touchstart', (e)=>{
      e.preventDefault();
      const t = e.changedTouches[0];
      touches[side] = t.identifier;
      const r = el.getBoundingClientRect();
      touches[`${side}Base`] = { x: r.left + r.width/2, y:r.top + r.height/2, knob, radius };
    }, {passive:false});
    el.addEventListener('touchmove', (e)=>{
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (t.identifier !== touches[side]) continue;
        const b = touches[`${side}Base`];
        const dx = t.clientX - b.x; const dy = t.clientY - b.y;
        const n = Utils.norm(dx, dy);
        const mag = Math.min(1, n.m / b.radius);
        const ox = n.x * mag; const oy = n.y * mag;
        state[side] = (mag < CONFIG.controls.deadzone) ? {x:0,y:0} : {x:ox,y:oy};
        b.knob.style.transform = `translate(${ox*28}px,${oy*28}px)`;
        if (side === 'aim') state.shooting = mag > .3;
      }
    }, {passive:false});
    el.addEventListener('touchend', (e)=>{
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (t.identifier !== touches[side]) continue;
        touches[side] = null; state[side] = {x:0,y:0};
        touches[`${side}Base`]?.knob.style.removeProperty('transform');
        if (side === 'aim') state.shooting = false;
      }
    }, {passive:false});
  }

  const keys = new Set();
  function onKey(e){ keys.add(e.code); if (e.code==='Space') state.ability = true; updateMove(); }
  function offKey(e){ keys.delete(e.code); updateMove(); }
  function updateMove() {
    state.move.x = (keys.has('KeyD')?1:0) - (keys.has('KeyA')?1:0);
    state.move.y = (keys.has('KeyS')?1:0) - (keys.has('KeyW')?1:0);
    const n = Utils.norm(state.move.x, state.move.y);
    state.move.x = n.x * Math.min(1,n.m);
    state.move.y = n.y * Math.min(1,n.m);
  }

  function onMouseMove(e) {
    const r = canvas.getBoundingClientRect();
    state.pointer = { x: (e.clientX-r.left)/r.width * CONFIG.game.width, y:(e.clientY-r.top)/r.height * CONFIG.game.height };
    state.aim = {x:0,y:0};
  }

  return {
    init,
    consumeAbility(){ const a = state.ability; state.ability = false; return a; },
    get() { return state; }
  };
})();
