module.exports = {

        name: 'pause',
        noalias: 'No Aliases',
        category: "music",
        description: 'Pause command.',
        usage: " ",
        accessableby: "everyone",
    run: async (bot, message, args, ops) => {
        const serverQueue = ops.queue.get(message.guild.id);
        const { channel } = message.member.voice;
      try {
        if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to pause music!');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send(" 봇과 같은 음성채널에 있어야합니다 ");
        };
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause(true);
            return message.channel.send(' 일시정지 됨  ⏸');
        }
        return message.channel.send(':cross-mark: 재생되고 있는 것이 없습니다 ');
      } catch {
          serverQueue.connection.dispatcher.end();
          await channel.leave();
      }
    }
};