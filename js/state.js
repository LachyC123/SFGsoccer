import { DEFAULT_SETTINGS, TEAMS } from "./config.js";
import { createCareer } from "./leagues.js";
import { newPlayerProfile } from "./progression.js";
import { loadSave, writeSave } from "./save.js";

function defaultState() {
  return {
    screen: "menu",
    settings: { ...DEFAULT_SETTINGS },
    teams: TEAMS.map((t) => ({ ...t, badge: "Shield" })),
    selectedTeamId: TEAMS[0].id,
    playerProfile: newPlayerProfile(),
    career: createCareer(TEAMS[0].id),
    match: null,
    lastMatch: null,
    notice: "",
  };
}

export function createState() {
  const fromSave = loadSave();
  const state = fromSave ? { ...defaultState(), ...fromSave } : defaultState();
  return {
    data: state,
    save() {
      writeSave({
        settings: state.settings,
        teams: state.teams,
        selectedTeamId: state.selectedTeamId,
        playerProfile: state.playerProfile,
        career: state.career,
      });
    },
  };
}
