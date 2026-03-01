export const badgeShapes = ["Shield", "Circle", "Diamond", "Bolt"];

export function applyTeamCustomization(team, form) {
  team.name = form.name || team.name;
  team.short = (form.short || team.short).slice(0, 4).toUpperCase();
  team.primary = form.primary;
  team.secondary = form.secondary;
  team.accent = form.accent;
  team.badge = form.badge;
}

export function applyPlayerLook(player, form) {
  player.name = form.name || player.name;
  player.shirt = Number(form.shirt) || player.shirt;
  player.look.skin = form.skin;
  player.look.hair = form.hair;
  player.look.hairColor = form.hairColor;
  player.look.boots = form.boots;
  player.look.accessory = form.accessory;
}
