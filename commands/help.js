const { prefix } = require('../config.json');
const Discord = require('discord.js');
const embed = new Discord.RichEmbed();
module.exports = {
    name: 'help',
    description: 'Listet alle Commands oder listet nur ein bestimmten Command.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(msg, args) {
        const data = [];
        const { commands } = msg.client;

        if(!args.length) {
            data.push('Hier ist eine Liste von allen meine Commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nDu kannst mir \`${prefix}help [command name]\` senden um spezifische Info's zum Command zu bekommen`);

            return msg.channel.send(data, { split: true });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if(!command) {
            return msg.channel.send('Dies ist kein Command!');
        }

        let description = "";
        description += `Cooldown: ${command.cooldown || 3} sekunden.`;
        if (command.aliases) description += `**Aliases:** ${command.aliases.join(', ')}`;
        if (command.description) description += `\n**Beschreibung:** ${command.description}`;
        if (command.usage) description += `\n***How-To:*** ${prefix}${command.name} ${command.usage}`;

        embed
        .setColor('#0099ff')
        .setTitle(`${command.name}`)
        .setAuthor('Sharkey')
        .setDescription(description);
        // data.push(`**Name:** ${command.name}`);
        // if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        // if (command.description) data.push(`**Description:** ${command.description}`);
        // if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        // data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
        // msg.channel.send(data, { split: true });
        msg.channel.send(embed);
    },
};