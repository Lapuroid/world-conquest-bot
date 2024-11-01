const User = require('../../models/user');
const Character = require('../../models/character');

module.exports = {
  name: 'battle',
  description: '',
  args: true,
  usage: '<user>',
  async execute(message, args) {
    const challenger = await User.findOne({ discordId: message.author.id });
    if (!challenger) {
      return message.channel.send(`Please register first.`);
  }

    const selectedC = await Character.findOne({ _id: challenger.selectedCharacter });
    if (!selectedC) {
      return message.channel.send(`You have not selected a character, ${message.author}. Please select a character.`);
    }

    const opponent = message.mentions.members.first();
    if (!opponent) {
      return message.channel.send('You need to mention a user to battle!');
    }

    const opp = await User.findOne({ discordId: opponent.id });
    if (!opp) {
      return message.channel.send(`${opponent} has not registered yet, please register first.`);
    }

    const selectedopp = await Character.findOne({ _id: opp.selectedCharacter });
    if (!selectedopp) {
      return message.channel.send(`${opponent} has not selected a character. Please select a character.`);
    }
    
  },
};