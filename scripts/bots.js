window.BotAI = {
  update(bot, game, dt) {
    bot.brainTimer = (bot.brainTimer || 0) - dt;
    if (bot.brainTimer <= 0) {
      bot.brainTimer = CONFIG.bot.retargetTime + Math.random() * .4;
      const enemies = game.units.filter(u => u.team !== bot.team && u.alive);
      bot.target = enemies.sort((a,b)=> Utils.dist(bot,a)-Utils.dist(bot,b))[0] || null;
      bot.roam = { x: Utils.rand(180, CONFIG.arena.width-180), y: Utils.rand(220, CONFIG.arena.height-220) };
    }

    if (!bot.target) return;
    const d = Utils.dist(bot, bot.target);
    const toEnemy = Utils.norm(bot.target.x - bot.x, bot.target.y - bot.y);

    const prefer = bot.hp / bot.maxHp < CONFIG.bot.retreatHealth ? -1 : 1;
    const goal = d > bot.range * .9 ? toEnemy : (d < bot.range * .55 ? {x:-toEnemy.x,y:-toEnemy.y} : {x:0,y:0});
    bot.input.move = { x: Utils.clamp(goal.x * prefer, -1, 1), y: Utils.clamp(goal.y * prefer, -1, 1) };
    bot.input.aim = toEnemy;
    bot.input.shooting = d <= bot.range * 1.15;
    bot.input.ability = (Math.random() < 0.004 * CONFIG.bot.aggression) && bot.cooldown <= 0;
  }
};
