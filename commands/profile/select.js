const User = require('../../models/user');
const Character = require('../../models/character');

module.exports = {
  name: 'select',
  description: 'Select a character.',
  args: true,
  usage: '<character name>',
  async execute(message, args) {
    const userId = message.author.id;
    const characterName = args.join(' ');
    try {
      const user = await User.findOne({ discordId: userId });
      if (!user) {
        await message.reply('You need to register first.'); 
        return;
      }

      const character = await Character.findOne({ alias: characterName });
      if (!character) {
        await message.reply('Character not found.'); 
        return;
      }

      user.selectedCharacter = character._id;
      await user.save();

      await message.reply(`You have selected ${character.name}.`); 
    } catch (err) {
      console.error(err);
      await message.reply('An error occurred while selecting the character.'); 
    }
  },
};