const request = require('node-superfetch');
const Color = "#FFFFFF";
const Discord = require("discord.js");
const disbut = require('discord-buttons');
const { MessageActionRow, MessageButton } = require("discord-buttons");
const { prefix, developerID, bot, support } = require("../../config.json")



module.exports = {
    name: "help",
    description: "Info",

    run: async (client, message, args) => {
        const embed = new Discord.MessageEmbed()
            .setTitle(`${bot}'s Help`)
            .setImage("https://cdn.discordapp.com/attachments/779341728695451678/897772426086215680/standard_22.gif")
            .setDescription(`**${message.author.username}**님 안녕하세요, \n *명령어를 보고 싶으신 카테고리를 선택해주세요* \n\n`)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(Color)
            .setFooter(`Requested by: ${message.author.tag}`)

        const music = new Discord.MessageEmbed()
            .setColor(Color)
            .setTitle(`Music`)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`음악재생 관련 명령어: \n\n \`leave\`, \`loop\`, \`nowplaying\`, \`pause\`,  \`play\`,  \`queue\`,  \`remove\`,  \`resume\`,  \`search\`,  \`skip\`,  \`skipall\`,  \`stop\`,  \`volume\``)
            .setFooter(`Requested by: ${message.author.tag}`)

        const info = new Discord.MessageEmbed()
            .setColor(Color)
            .setTitle(`Info`)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`봇 관련 명령어: \n\n \`help\`, \`invite\`, \`setprefix\`,  \`setpre\`,  \`removepremium\``)
            .setFooter(`Requested by: ${message.author.tag}`)

        let button1 = new MessageButton()
            .setLabel(`Music`)
            .setID(`music`)
            .setStyle("blurple");

        let button2 = new MessageButton()
            .setLabel(`Info`)
            .setID(`info`)
            .setStyle("green");

        let row = new MessageActionRow()
            .addComponents(button1, button2);

        const MESSAGE = await message.channel.send(embed, row);

        const filter = (button) => button.clicker.user.id === message.author.id
        const collector = MESSAGE.createButtonCollector(filter, { time: 300000 });

        collector.on('collect', async (b) => {
            if (b.id == "music") {
                MESSAGE.edit(music, row);
                await b.reply.defer()
            }
            if (b.id == "info") {
                MESSAGE.edit(info, row);
                await b.reply.defer()
            }
        });
    }
};