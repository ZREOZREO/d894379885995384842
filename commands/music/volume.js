module.exports = {
        name: 'volume',
        aliases: ["vol"],
        category: "music",
        description: 'Shows and changes volume.',
        usage: ', vol [volume]',
        accessableby: "everyone",
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('볼륨을 조절하기 위해서는 음성채널에 접속해야 합니다');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**봇과 같은 음성채널에 있어야합니다**");
          }
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('재생되고 있는 것이 없습니다');
        if (!args[0]) return message.channel.send(`현재 볼륨: **${serverQueue.volume}**`);
      try {
        serverQueue.volume = args[0];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
        return message.channel.send(`볼륨을 **${args[0]}**로 설정했습니다`);
      } catch {
          return message.channel.send('**오류가 발생했습니다**');
      }
    }
};