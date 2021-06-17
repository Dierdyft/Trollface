const Discord = require("discord.js");
const Canvas = require("canvas");

module.exports = {
  name: "tortuga",
  description: "Llega carl-bot",
  category: "Diversion",
  cooldown: 5,
  aliases: ["turtle"],
  args: false,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "<usuario>",
  execute: async (client, message, args, prefix) => {

    let user =
      message.mentions.users.first() ||
      client.users.cache.get(args[0]) ||
      message.author;

    try {

      const canvas = Canvas.createCanvas(867, 892);
      const ctx = canvas.getContext("2d");
      const background = await Canvas.loadImage(
        "https://cdn.discordapp.com/avatars/235148962103951360/cececd50fdc87b29929e65c768f24ad6.png"
      );
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      const avatar = await Canvas.loadImage(
        user.displayAvatarURL({ format: "png" })
      );
      ctx.drawImage(avatar, 60, 320, 205, 205);
      const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        `${user.username}_es_una_tortuga.jpg`
      );
      message.channel.send(attachment);
    } catch (e) {
      const error = new Discord.MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(
          "<:XD:804920471698145320> Ha ocurrido un error: " + e.message
        )
        .setColor("RED")
        .setTimestamp();
      return message.channel.send(error);
    }
  }
};
