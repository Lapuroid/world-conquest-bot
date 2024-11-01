// blaze.js
module.exports = {
    name: 'Blaze',
    effect: (attacker, defender, battle) => {
      const damage = 20; // Example damage value for Blaze
      defender.health = Math.max(0, defender.health - damage);
      battle.log.push(`${attacker.name} used Blaze for ${damage} damage.`);
      return { success: true, message: `Blaze dealt ${damage} damage to ${defender.name}.` };
    },
  };
  