const { MessageEmbed, Util } = require("discord.js")
const { GOOGLE_API_KEY } = require('../../config')
const YouTube = require("simple-youtube-api");
const youtube = new YouTube(GOOGLE_API_KEY);
const ytdl = require('ytdl-core');

module.exports = {
        name: "search",
        category: "music",
        noalias: [''],
        description: "Searches music from YouTube",
        usage: " ",
        accessableby: "everyone",
    run: async (bot, message, args, ops) => {
        if (!args[0]) return message.channel.send("**노래의 번호를 입력해주세요**")
        const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
        const searchString = args.slice(1).join(' ');

        const { channel } = message.member.voice;
        if (!channel) return message.channel.send("**음성채널에 접속해있지 않습니다**");


        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) {
            return message.channel.send('음성채널에 연결할 수 없습니다. 권한이 있는지 확인해주세요');
        }
        if (!permissions.has('SPEAK')) {
            return message.channel.send('음성채널에서 노래를 재생할 수 없습니다. 권한이 있는지 확인해주세요');
        }

        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();

            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, message, channel, true);
            }
        }
        else {
            try {
                var video = await youtube.getVideo(url);
                console.log(video)
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    const sembed = new MessageEmbed()
                        .setColor("#FFFFFF")
                        .setFooter(message.member.displayName, message.author.avatarURL())
                        .setDescription(`
                    __**Song selection:**__\n
                    ${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
                    \n1-10번까지의 노래중 원하는 번호를 선택해주세요.
                                    `)
                        .setTimestamp();
                    message.channel.send(sembed).then(message2 => message2.delete({ timeout: 10000 }))
                    try {
                        var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                            max: 1,
                            time: 10000,
                            errors: ['time']
                        });
                    } catch (err) {
                        console.log(err);
                        return message.channel.send('❌ **시간 초과**')
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return message.channel.send('🆘 검색 결과를 얻을 수 없습니다');
                }
            }
            return handleVideo(video, message, channel);

        }

        async function handleVideo(video, message, channel, playlist = false) {
            const serverQueue = ops.queue.get(message.guild.id);
            const song = {
                id: video.id,
                title: Util.escapeMarkdown(video.title),
                url: `https://www.youtube.com/watch?v=${video.id}`,
                thumbnail: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
            };
            if (!serverQueue) {
                const queueConstruct = {
                    textChannel: message.channel,
                    voiceChannel: channel,
                    connection: null,
                    songs: [],
                    volume: 3,
                    playing: true,
                    loop: false
                };
                ops.queue.set(message.guild.id, queueConstruct);
                queueConstruct.songs.push(song);
                try {
                    var connection = await channel.join();
                    queueConstruct.connection = connection;
                    play(message.guild, queueConstruct.songs[0], message);
                } catch (error) {
                    console.error(`음성채널에 접속할 수 없습니다: ${error}`);
                    ops.queue.delete(message.guild.id);
                    return undefined;
                }

            } else {
                serverQueue.songs.push(song);
                console.log(serverQueue.songs);
                if (playlist) return undefined;
                else {
                    const embed = new MessageEmbed()
                        .setColor("#FFFFFF")
                        .setTitle("재생목록에 추가됨")
                        .setThumbnail(song.thumbnail)
                        .setTimestamp()
                        .setDescription(`**${song.title}** 이 재생목록에 추가됨`)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL());
                    message.channel.send(embed)
                }
            }
            return undefined;
        }
        async function play(guild, song, msg) {
            const serverQueue = ops.queue.get(guild.id);

            if (!song) {
                serverQueue.voiceChannel.leave()
                ops.queue.delete(guild.id);
                return;
            }

            const dispatcher = serverQueue.connection.play(await ytdl(song.url, { filter: "audioonly", highWaterMark: 1 << 20, quality: "highestaudio" }))
                .on('finish', () => {
                    if (serverQueue.loop) {
                        serverQueue.songs.push(serverQueue.songs.shift());
                        return play(guild, serverQueue.songs[0], msg)
                    }
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0], msg)

                })
                .on('error', error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

            const embed = new MessageEmbed()
                .setColor("#FFFFFF")
                .setTitle('현재 재생중\n')
                .setThumbnail(song.thumbnail)
                .setTimestamp()
                .setDescription(`🎵 현재 재생중:\n **${song.title}** 🎵`)
                .setFooter(msg.member.displayName, msg.author.displayAvatarURL());
            serverQueue.textChannel.send(embed);

        };
    }
};