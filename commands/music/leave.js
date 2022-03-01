module.exports = {

    name: 'leave',
    aliases: ['stop', 'dc'],
    category: 'music',
    description: 'Leaves The User\'s VC',
    usage: ' ',
    accessableby: 'everyone',
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        const serverQueue = ops.queue.get(message.guild.id);
        try {
            if (!channel) return message.channel.send(' 음성채널에 접속해있어야 합니다. ');
            if (!channel.permissionsFor(bot.user).has(['CONNECT', 'SPEAK', 'VIEW_CHANNEL'])) {
                return message.channel.send(" 권한이 없습니다 ");
            };
            if (!message.guild.me.voice.channel) return message.channel.send('❌  봇이 음성채널에 있지 않습니다 ');

            if (serverQueue || serverQueue.playing) {
                serverQueue.connection.dispatcher.end();
                await channel.leave();
                return message.channel.send(" ✅ 음성채널을 나갔습니다 ");
            } else {
                await channel.leave();
                return message.channel.send(" ✅ 음성채널을 나갔습니다 ");
            }
        } catch {
            serverQueue.connection.dispatcher.end();
            await channel.leave();
            return message.channel.send(" 오류가 발생했습니다. 다시 시도해주세요 ");
        }
    }
}