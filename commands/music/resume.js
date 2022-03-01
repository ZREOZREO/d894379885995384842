module.exports = {

        name: 'resume',
        aliases: ["res"],
        category: "music",
        description: 'resumes music',
        usage: " ",
        accessableby: "everyone",
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('일시정지를 해제하기 위해서는 봇과 같은 음성채널에 있어야합니다');
        const serverQueue = ops.queue.get(message.guild.id);
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**봇과 같은 음성채널에 있어야합니다!**");
        }
      try {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.channel.send('▶ **일시정지 해제됨**');
        }
        return message.channel.send('**일시정지를 해제할 것이 없습니다**.');
      } catch {
        serverQueue.connection.dispatcher.end();
        return message.channel.send("**오류가 발생했습니다**")
      }
    }
};