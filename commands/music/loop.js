module.exports = {
  
        name: 'loop',
        aliases: ["repeat"],
        category: "music",
        description: 'Repeats all songs in the queue',
        usage: " ",
        accessableby: "everyone",
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('반복을 활성화 하기 위해서는 음성채널에 접속해있어야 합니다');
        const serverQueue = ops.queue.get(message.guild.id);
    try {
        if (!serverQueue) return message.channel.send('There is nothing playing.');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send(" 봇과 같은 음성채널에 있어야 합니다 ");
        }
        if (!serverQueue.loop) {
            serverQueue.loop = true;
            return message.channel.send('🔁 반복이 활성화 되었습니다');
        } else {
            serverQueue.loop = false;
            return message.channel.send('🔁 반복이 비활성화 되었습니다');
        }
      } catch {
          serverQueue.connection.dispatcher.end();
          await channel.leave();
          return message.channel.send(" 오류가 발생했습니다. 다시 시도해주세요 ");
      }
    }
};