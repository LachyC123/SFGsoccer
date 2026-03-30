window.AudioSys = (() => {
  let ctx;
  const ensure = () => ctx || (ctx = new (window.AudioContext || window.webkitAudioContext)());
  const beep = (f=440,d=0.06,t='square',g=0.05) => {
    const c = ensure();
    const o = c.createOscillator();
    const n = c.createGain();
    o.type = t; o.frequency.value = f;
    n.gain.value = g;
    o.connect(n); n.connect(c.destination);
    o.start();
    n.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + d);
    o.stop(c.currentTime + d);
  };
  return {
    uiTap(){ beep(620,.03,'triangle',.03); },
    shoot(){ beep(180,.04,'sawtooth',.022); },
    hit(){ beep(260,.03,'square',.028); },
    elim(){ beep(140,.08,'triangle',.05); },
    victory(){ beep(520,.08,'triangle',.04); setTimeout(()=>beep(720,.11,'triangle',.05),80); },
    defeat(){ beep(180,.2,'sine',.04); }
  };
})();
