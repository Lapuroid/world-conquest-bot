const User = require('../../models/user'); // Adjust import paths as necessary

module.exports = {
  name: 'register',
  description: 'Register a new user.',
  async execute(message, args) {
    const userId = message.author.id;
    const username = message.author.username;

    if (!username) {
      await message.reply('Please specify a username to register.'); // Ensure it returns a Promise
      return;
    }

    try {
      // Check if the user is already registered
      const existingUser = await User.findOne({ discordId: userId });

      if (existingUser) {
        await message.reply('You are already registered.'); // Ensure it returns a Promise
        return;
      }

      // Create and save the new user
      const newUser = new User({
        discordId: userId,
        username: username, // Assuming you have a 'username' field
      });

      await newUser.save();

      await message.reply(`You have been registered with the username ${username}.`); // Ensure it returns a Promise
    } catch (err) {
      console.error(err);
      await message.reply('An error occurred while registering the user.'); // Ensure it returns a Promise
    }
  },
};