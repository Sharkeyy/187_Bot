const cron = require('cron');
let scheduledMessage;
module.exports = {
    name: 'funk',
    description: 'generiert stündlich neue Funknummer',
    usage: '<command>',
    execute(msg, args) {
        if (msg) {
            if (!args.length) {
                return msg.reply(`Bitte gebe einen Argument an. Beispiel: 187_funk start oder 187_funk stop`);
            } else {
                if (args.length > 1) {
                    return msg.reply(`Bitte nur einen Argument angeben.`);
                }
                const argument = args[0];
                if (argument == "start") {
                    const funknummer = Math.floor(Math.random() * 90000) + 10000;
                    msg.channel.send("NEUER FUNKCODE: " + funknummer);
                    msg.channel.send();
                    scheduledMessage = new cron.CronJob('*/5 * * * * *', () => {
                        // This runs every day at 10:30:00, you can do anything you want
                        const funk = Math.floor(Math.random() * 90000) + 10000;
                        msg.channel.send("NEUER FUNKCODE: " + funk);
                    });
                    scheduledMessage.start();
                } else if (argument == "stop") {
                    scheduledMessage.stop();
                } else if (argument == "generate") {
                    const funk = Math.floor(Math.random() * 90000) + 10000;
                    msg.channel.send("NEUER FUNKCODE: " + funk);
                }
            }
        }
    }
};