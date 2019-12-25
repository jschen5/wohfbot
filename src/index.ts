import * as Discord from 'discord.js';
import * as Markov from './markov';
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

    if (msg.content.match(/^What would .+ say\??$/)) {
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

            const lastMessage = msgs.last();
            if (!lastMessage)
                break;

            lastOldestMessageId = lastMessage.id;
        }

        const msgArray = allMessages
            .filter(m => m.content.length > 0)
            .map(m => m.content);

        console.log('GENERATING MARKOV CHAIN');

        const chainData = Markov.markovDataFromMessages(msgArray);
        const wohfMessage = Markov.messageFromMarkovData(chainData);
        console.log(wohfMessage);

        msg.channel.send(wohfMessage);
    }
});

client.login(discordConfig.token);