const Discord = require("discord.js");
const Canvas = require("canvas");

module.exports = {
  name: "soy-admin",
  description: "ADMINISTRADOR",
  category: "Diversion",
  cooldown: 5,
  aliases: ["soyadmin"],
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

    let avatar = user.displayAvatarURL({
      dynamic: false,
      size: 128,
      format: "png"
    });

    try {

      const canvas = Canvas.createCanvas(468, 415);
      const ctx = canvas.getContext("2d");

      let bg = await Canvas.loadImage(
        "https://cdn.discordapp.com/attachments/750461925099307129/752473603127377961/IMG_20200907_051913_014.JPG"
      );
      ctx.drawImage(bg, 0, 0);

      ctx.beginPath();
      ctx.arc(canvas.width / 2, 70, 60, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.clip();

      let imagen = await Canvas.loadImage(avatar);
      ctx.drawImage(imagen, 169, 10.7);

      let att = new Discord.MessageAttachment(canvas.toBuffer(), "SoyAdmin.png");
      message.channel.send(att);

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
