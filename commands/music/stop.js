module.exports = {

        name: 'stop',
        noalias: [''],
        category: "music",
        description: "stops the music playing",
        usage: ' ',
        acessableby: "everyone",
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('정지하기 위해서는 음성채널에 접속해야 합니다');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**봇과 같은 음성채널에 있어야합니다**");
          }
        const serverQueue = ops.queue.get(message.guild.id);
      try {
        if (serverQueue) {
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end()
        message.guild.me.voice.channel.leave();
        } else {
        channel.leave();
        }
        return message.channel.send('👋 **연결해제됨**')
      } catch {
          serverQueue.connection.dispatcher.end();
          await channel.leave();
          return message.channel.send("**오류가 발생했습니다.**");
      }
    }
};