# Neon Rift Arena

Neon Rift Arena is a **mobile-first browser hero arena shooter vertical slice** built with only HTML, CSS, and vanilla JavaScript. It is designed for instant play on GitHub Pages with no backend.

## Highlights
- Polished boot flow and animated lobby
- 8 original heroes with unique roles, stats, and simple active abilities
- One complete mode: **Score Clash** (team elimination race)
- Touch joystick + aim controls for mobile, WASD/mouse fallback for desktop
- Bot-driven combat pressure with respawns and team scoring
- Match intro, HUD, combat feedback, and end-of-match rewards/progression loop

## File Structure

```
/index.html
/styles/main.css
/scripts/config.js
/scripts/utils.js
/scripts/heroes.js
/scripts/audio.js
/scripts/input.js
/scripts/bots.js
/scripts/game.js
/scripts/ui.js
/scripts/main.js
/assets/ui/
/assets/sfx/
/assets/data/
/README.md
```

## Run Locally
You can open `index.html` directly, but a local server is recommended:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy to GitHub Pages
1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Choose branch `main` (or your default branch) and folder `/ (root)`.
5. Save and wait for deployment.

No build step is required.

## Tuning Guide

### Hero stats
Edit `scripts/heroes.js` to tweak:
- `hp`, `speed`, `fireRate`, `damage`, `projectile`, `spread`, `range`
- `ability` and `cooldown`

### Match and arena rules
Edit `scripts/config.js` to tweak:
- `game.scoreLimit`, `game.matchTime`, `game.respawnTime`
- `arena.width`, `arena.height`, wall layout, spawn points
- `bot` aggression and retarget timings
- `controls` stick sensitivity/deadzone
- `progression` rewards

### UI and colors
Edit `styles/main.css`:
- Theme colors in `:root`
- Button/panel gradients, glow, and spacing
- Touch control sizes and HUD placement

### Bot behavior
Edit `scripts/bots.js`:
- Retarget cadence
- Chase/retreat range decisions
- Ability trigger aggressiveness

## Notes
- Designed for portrait orientation first.
- Static-host safe paths and script order.
- No external frameworks, packages, or build tools.
