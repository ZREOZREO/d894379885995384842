const { MessageEmbed } = require('discord.js');

module.exports = {
  
        name: 'queue',
        aliases: ["q"],
        category: "music",
        description: 'shows queued songs',
        usage: " ",
        accessableby: "everyone",
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('재생목록을 보기 위해서는 봇과 같은 음성채널에 있어야합니다');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**봇과 같은 음성채널에 있어야합니다**");
        };
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('❌ **서버에서 재생되고 있는 것이 없습니다**');
      try {
        let currentPage = 0;
        const embeds = generateQueueEmbed(message, serverQueue.songs);
        const queueEmbed = await message.channel.send(`**현재 페이지 - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
        await queueEmbed.react('⬅️');
        await queueEmbed.react('⏹');
        await queueEmbed.react('➡️');

        const filter = (reaction, user) => ['⬅️', '⏹', '➡️'].includes(reaction.emoji.name) && (message.author.id === user.id);
        const collector = queueEmbed.createReactionCollector(filter);
        
        collector.on('collect', async (reaction, user) => {
          try {
            if (reaction.emoji.name === '➡️') {
                if (currentPage < embeds.length - 1) {
                    currentPage++;
                    queueEmbed.edit(`**현재 페이지 - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                } 
            } else if (reaction.emoji.name === '⬅️') {
                if (currentPage !== 0) {
                    --currentPage;
                    queueEmbed.edit(`**현재 페이지 - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                }
            } else {
                collector.stop();
                reaction.message.reactions.removeAll();
            }
            await reaction.users.remove(message.author.id);
          } catch {
            serverQueue.connection.dispatcher.end();
            return message.channel.send("**권한 없음 - [ADD_REACTIONS, MANAGE_MESSAGES]!**");
          }
        });
      } catch {
          serverQueue.connection.dispatcher.end();
          return message.channel.send("**권한 없음 - [ADD_REACTIONS, MANAGE_MESSAGES]!**");
      }
    }
};

function generateQueueEmbed(message, queue) {
    const embeds = [];
    let k = 10;
    for (let i = 0; i< queue.length; i += 10) {
        const current = queue.slice(i, k);
        let j = i;
        k += 10;
        const info = current.map(track => `${++j} - [${track.title}](${track.url})`).join('\n');
        const embed = new MessageEmbed()
            .setTitle('Song Queue\n')
            .setThumbnail(message.guild.iconURL())
            .setColor('#FFFFFF')
            .setDescription(`**현재 노래 - [${queue[0].title}](${queue[0].url})**\n\n${info}`)
            .setTimestamp();
        embeds.push(embed);
    }
    return embeds;
}