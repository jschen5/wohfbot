import * as Discord from 'discord.js';
const discordConfig = require('../discord.json');

const client = new Discord.Client();

function isGeneralChannel(channel: Discord.Channel): boolean {
    return (channel as Discord.TextChannel).name === 'general';
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    if (msg.content === 'wohf ping') {
        msg.reply('wohf pong');
    }

    if (msg.content.match(/^fetch channels/)) {
        const targetUser = msg.mentions.users.first();
        let allMessages = new Discord.Collection<string, Discord.Message>();

        const channel = client.channels.find(c =>
            c.type === 'text' && isGeneralChannel(c)) as Discord.TextChannel;

        let lastOldestMessageId: string | null = null;

        while (allMessages.size < 500) {
            const msgs = await channel.fetchMessages({
                limit: 100,
                ...lastOldestMessageId && { before: lastOldestMessageId }
            });
            const msgsForUser = msgs.filter(m => m.author.id === targetUser.id);
            allMessages = allMessages.concat(msgsForUser);
            lastOldestMessageId = msgs.last().id;
        }

        const msgArray = allMessages
            .filter(m => m.cleanContent.length > 0)
            .map(m => m.cleanContent);

        console.log(msgArray);
    }
});

client.login(discordConfig.token);