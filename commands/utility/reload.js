const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    args: true,
    async execute(message, args) {
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
        }

        try {
            // Find the command folder
            const commandFolders = fs.readdirSync(path.join(__dirname, '../commands'));
            const folderName = commandFolders.find(folder => 
                fs.readdirSync(path.join(__dirname, `../commands/${folder}`)).includes(`${command.name}.js`)
            );

            if (!folderName) {
                return message.channel.send(`Command folder for \`${command.name}\` not found.`);
            }

            // Clear the cache for the command
            const commandPath = path.join(__dirname, `../commands/${folderName}/${command.name}.js`);
            delete require.cache[require.resolve(commandPath)];

            // Reload the command
            const newCommand = require(commandPath);
            message.client.commands.set(newCommand.name, newCommand);

            message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            message.channel.send(`There was an error while reloading the command \`${commandName}\`:\n\`${error.message}\``);
        }
    },
};