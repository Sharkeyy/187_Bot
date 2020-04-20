console.clear();
const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.login(token);

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
	client.user.setStatus('available');

	// client.user.setActivity('TibEj', { type: 'WATCHING', url: 'https://www.twitch.tv/tibej' })
	// .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
	// .catch(console.error);
});

client.on('message', msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	if (command.guildOnly && msg.channel.type !== 'text') {
		return msg.reply('Ich kann diesen Befehl nicht ausführen als DM!');
	}

	if (command.args && !args.length) {
		let reply = `Es fehlen benötigte angaben, ${msg.author}!`;
		if (command.usage) {
			reply += `\nDie richtige nutzung wäre: \`${prefix}${command.name} ${command.usage}\``;
		}
		return msg.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now;
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(msg.author.id)) {
		const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return msg.reply(`Bitte warte ${timeLeft.toFixed(1)} Sekunden bevor du wieder \`${command.name}\` benutzt.`);
		}
	} else {
		timestamps.set(msg.author.id, now);
		setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
	}

	try {
		client.commands.get(commandName).execute(msg, args);
	} catch (error) {
		console.error(error);
		msg.reply('Fehler beim ausführen des Commands!');
	}
});