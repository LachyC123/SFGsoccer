import { LEAGUES, TEAMS } from "./config.js";

function seededTeams() {
  const copy = [...TEAMS];
  const groups = [[], [], [], []];
  copy.forEach((t, i) => groups[i % 4].push(t.id));
  return groups;
}

export function createCareer(clubId) {
  const groups = seededTeams();
  if (!groups[0].includes(clubId)) {
    groups[0][0] = clubId;
  }
  const divisions = LEAGUES.map((lg, i) => ({
    ...lg,
    teams: groups[i],
    table: makeTable(groups[i]),
    fixtures: scheduleRoundRobin(groups[i]),
    played: 0,
  }));

  return {
    season: 1,
    currentLeague: 0,
    clubId,
    budget: 1000,
    fans: 1200,
    rep: 1,
    objectives: ["Finish top 3", "Score 20 goals this season"],
    divisions,
    history: [],
  };
}

function makeTable(teamIds) {
  return teamIds.map((id) => ({ id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }));
}

function scheduleRoundRobin(teamIds) {
  const fixtures = [];
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      fixtures.push({ home: teamIds[i], away: teamIds[j], played: false, score: null });
      fixtures.push({ home: teamIds[j], away: teamIds[i], played: false, score: null });
    }
  }
  return fixtures;
}

export function recordResult(division, homeId, awayId, hg, ag) {
  const fixture = division.fixtures.find((f) => !f.played && f.home === homeId && f.away === awayId);
  if (fixture) {
    fixture.played = true;
    fixture.score = [hg, ag];
    division.played += 1;
  }
  const home = division.table.find((t) => t.id === homeId);
  const away = division.table.find((t) => t.id === awayId);
  if (!home || !away) return;
  home.p++; away.p++;
  home.gf += hg; home.ga += ag; away.gf += ag; away.ga += hg;
  if (hg > ag) { home.w++; home.pts += 3; away.l++; }
  else if (ag > hg) { away.w++; away.pts += 3; home.l++; }
  else { home.d++; away.d++; home.pts++; away.pts++; }
  home.gd = home.gf - home.ga;
  away.gd = away.gf - away.ga;
  division.table.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
}

export function seasonFinished(division) {
  return division.fixtures.every((f) => f.played);
}
