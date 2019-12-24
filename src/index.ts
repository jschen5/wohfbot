import * as Discord from 'discord.js';

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.login('NjU5MTIxOTgxOTI4NzY3NDg5.XgJy2Q.j8b2vOncMBxdWKeHmtCIiTEtCHc');