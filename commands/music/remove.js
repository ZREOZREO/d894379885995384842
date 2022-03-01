module.exports = {

        name: "remove",
        aliases: ["rs"],
        category: "music",
        description: "Remove Song In A Queue!",
        usage: "[song number]",
        acessableby: "everyone",
    run: async (bot, message, args, ops) => {
        if (!args[0]) return message.channel.send("**노래의 번호를 입력해주세요**")

        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('노래를 지우기 위해서는 봇과 같은 음성채널에 있어야합니다');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**봇과 같은 음성채널에 있어야합니다**");
        };
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('❌ **서버에서 재생되고 있는 것이 없습니다**');
      try {
        if (args[0] < 1 && args[0] >= serverQueue.songs.length) {
            return message.channel.send('**유효한 노래의 번호를 입력해주세요**');
        }
        serverQueue.songs.splice(args[0] - 1, 1);
        return message.channel.send(`재생목록에서 ${args[0]}번 노래를 지웠습니다`);
      } catch {
          serverQueue.connection.dispatcher.end();
          return message.channel.send("**오류가 발생했습니다**")
      }
    }
};