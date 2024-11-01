const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    args: true,
    usage: '<command name>',
    async execute(message, args) {
        // Join the arguments to allow for folder/command format (e.g., 'gameplay/battle')
        const commandName = args.join(' ').toLowerCase();

        // Attempt to find the command directly from the commands collection
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
        }

        try {
            // Find the command folder and the command file
            const commandFolders = fs.readdirSync(path.join(__dirname, '../'));
            let commandPath = null;

            // Search through each folder for the command file
            for (const folder of commandFolders) {
                const folderPath = path.join(__dirname, `../${folder}`);

                // Ensure it's a directory
                if (fs.statSync(folderPath).isDirectory()) {
                    const files = fs.readdirSync(folderPath);

                    // Check for the command file directly in the folder
                    if (files.includes(`${command.name}.js`)) {
                        commandPath = path.join(folderPath, `${command.name}.js`);
                        break; // Exit the loop once the command file is found
                    }

                    // Check for the folder/command format
                    if (commandName.startsWith(`${folder}/`)) {
                        const specificCommand = commandName.split('/')[1]; // Get the command name after the folder
                        if (files.includes(`${specificCommand}.js`)) {
                            commandPath = path.join(folderPath, `${specificCommand}.js`);
                            break;
                        }
                    }
                }
            }

            if (!commandPath) {
                return message.channel.send(`Command \`${commandName}\` not found in any folder.`);
            }

            // Clear the cache for the command
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