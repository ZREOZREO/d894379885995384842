module.exports = {
        name: 'skip',
        description: 'Skip command.',
        category: "music",
        aliases: ["s"],
        usage: " ",
        accessableby: "everyone",
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('스킵하기 위해서는 음성채널에 접속해야 합니다');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**봇과 같은 음성채널에 있어야합니다**");
          }
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('❌ **서버에서 재생되고 있는 것이 없습니다**');
      try {
        serverQueue.connection.dispatcher.end();
        return message.channel.send('⏩ 건너뛰기 됨')
      } catch {
          serverQueue.connection.dispatcher.end();
          await channel.leave();
          return message.channel.send("**오류가 발생했습니다**")
      }
    }
};