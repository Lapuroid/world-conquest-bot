const { EmbedBuilder } = require('discord.js');

const prefix = '!';

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    async execute(message, args) {
        const { commands } = message.client;
        const data = [];
        const embed = new EmbedBuilder()
            .setColor('#ff0066')
            .setTitle('Help - Command List')
            .setDescription('Here\'s a list of all my commands:')
            .setTimestamp()
            .setFooter({ text: 'By no neuron', iconURL: message.client.user.displayAvatarURL() });

        if (!args.length) {
            // Display all commands
            const commandList = [];
            commands.forEach(command => {
                let description = command.description || 'No description';
                let category = command.category || 'General';
                let usage = command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : `\`${prefix}${command.name}\``;
                commandList.push({
                    name: `**${command.name}**`,
                    value: `${description}\nCategory: ${category}\nUsage: ${usage}`
                });
            });

            const pages = Math.ceil(commandList.length / 10);
            for (let i = 0; i < pages; i++) {
                const pageEmbed = new EmbedBuilder()
                    .setColor('#ff0066')
                    .setTitle('Help - Command List')
                    .setDescription(`Here\'s a list of all my commands (Page ${i + 1}/${pages}):`)
                    .setTimestamp()
                    .setFooter({ text: 'By no neuron', iconURL: message.client.user.displayAvatarURL() });
                
                pageEmbed.addFields(commandList.slice(i * 10, (i + 1) * 10));
                await message.channel.send({ embeds: [pageEmbed] });
            }
        } else {
            // Display specific command info
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) {
                return message.reply('That\'s not a valid command!');
            }

            let description = command.description || 'No description';
            let category = command.category || 'General';
            let usage = command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : `\`${prefix}${command.name}\``;

            embed
                .setTitle(`Command: ${command.name}`)
                .setDescription(description)
                .addFields(
                    { name: 'Category', value: category, inline: true },
                    { name: 'Usage', value: usage, inline: true },
                    { name: 'Cooldown', value: `${command.cooldown || 3} second(s)`, inline: true }
                );

            return message.channel.send({ embeds: [embed] });
        }
    },
};
