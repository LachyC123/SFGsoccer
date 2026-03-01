export const GAME_TITLE = "Turbo Street Strikers";

export const MATCH = {
  width: 1280,
  height: 720,
  pitch: { x: 110, y: 70, w: 1060, h: 580 },
  goalSize: 180,
  defaultHalfLength: 180,
  kickoffBuffer: 1.1,
  maxPlayersPerTeam: 5,
};

export const DIFFICULTIES = {
  Easy: { reaction: 0.55, passBias: 0.35, tackleBias: 0.2, shotBias: 0.45 },
  Normal: { reaction: 0.75, passBias: 0.45, tackleBias: 0.3, shotBias: 0.56 },
  Hard: { reaction: 0.92, passBias: 0.62, tackleBias: 0.48, shotBias: 0.68 },
  "Arcade Pro": { reaction: 1.06, passBias: 0.7, tackleBias: 0.62, shotBias: 0.78 },
};

export const LEAGUES = [
  { id: "spark", name: "Spark Circuit", tier: 4 },
  { id: "volt", name: "Volt Division", tier: 3 },
  { id: "nova", name: "Nova League", tier: 2 },
  { id: "titan", name: "Titan Crown", tier: 1 },
];

export const TEAMS = [
  { id: "neon_foxes", name: "Neon Foxes", short: "NFX", city: "Lumos Bay", primary: "#ff5f7f", secondary: "#1b2142", accent: "#ffd166" },
  { id: "iron_comets", name: "Iron Comets", short: "COM", city: "Riveton", primary: "#36b9ff", secondary: "#102038", accent: "#ffffff" },
  { id: "pulse_hammers", name: "Pulse Hammers", short: "HMR", city: "Drift Forge", primary: "#ffd046", secondary: "#6b2d09", accent: "#6fffe9" },
  { id: "velvet_storm", name: "Velvet Storm", short: "VST", city: "Nightbridge", primary: "#ab5bff", secondary: "#24103b", accent: "#42f5a7" },
  { id: "aqua_riot", name: "Aqua Riot", short: "AQR", city: "Harborline", primary: "#30d7d0", secondary: "#06425f", accent: "#fafafa" },
  { id: "ember_dynamo", name: "Ember Dynamo", short: "EMD", city: "Flareside", primary: "#ff7447", secondary: "#4e1a17", accent: "#f5ff8a" },
  { id: "skyline_jets", name: "Skyline Jets", short: "SKJ", city: "Aeroset", primary: "#80ed99", secondary: "#1a3a2f", accent: "#2ec4ff" },
  { id: "onyx_brigade", name: "Onyx Brigade", short: "ONX", city: "Blackvale", primary: "#fafafa", secondary: "#1d2029", accent: "#ff4f70" },
];

export const DEFAULT_SETTINGS = {
  volume: 0.65,
  cameraShake: true,
  assists: true,
};

export const ATTRIBUTES = [
  "speed", "acceleration", "strength", "shotPower", "shotAccuracy", "passing",
  "ballControl", "tackling", "stamina", "aerial", "curve", "reactions", "aggression",
];
