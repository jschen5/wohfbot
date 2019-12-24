import * as Discord from 'discord.js';
const discordConfig = require('../discord.json');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    if (msg.content === 'wohf ping') {
        msg.reply('wohf pong');
    }

    if (msg.content === 'fetch channels') {
        const msgs = new Discord.Collection<string, Discord.Message>();

        // const msgs = await msg.channel.fetchMessages({
        //     limit: 100
        // });
        console.log(msgs);
    }
});

client.login(discordConfig.token);