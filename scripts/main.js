(() => {
  const navButtons = () => document.querySelectorAll('.lobby-nav .nav-btn');

  function bindUI() {
    document.getElementById('playBtn').addEventListener('click', () => { AudioSys.uiTap(); UI.showVersusThenMatch(); });
    navButtons().forEach(btn => btn.addEventListener('click', () => { AudioSys.uiTap(); UI.openPanel(btn.dataset.screen); }));
    document.getElementById('backToLobby').addEventListener('click', () => { AudioSys.uiTap(); UI.setScreen('lobbyScreen'); UI.renderLobby(); });
    document.getElementById('playAgainBtn').addEventListener('click', () => { AudioSys.uiTap(); UI.showVersusThenMatch(); });
    document.getElementById('returnLobbyBtn').addEventListener('click', () => { AudioSys.uiTap(); UI.setScreen('lobbyScreen'); UI.renderLobby(); });

    // mobile browser comfort and accidental gestures prevention
    document.addEventListener('gesturestart', e => e.preventDefault());
    document.addEventListener('dblclick', e => e.preventDefault());
    document.body.addEventListener('touchmove', e => e.preventDefault(), { passive:false });
  }

  window.addEventListener('DOMContentLoaded', () => {
    bindUI();
    UI.bootSequence();
  });
})();
