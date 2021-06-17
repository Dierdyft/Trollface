const Discord = require("discord.js");
const { createCanvas, loadImage } = require('canvas')
const iuv = require("image-url-validator").default

module.exports = {
  name: "lo-peor",
  description: "El hombre que vio lo peor de internet",
  category: "Diversion",
  cooldown: 5,
  aliases: ["lopeor"],
  args: false,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "<usuario | enlace | archivo>",
  execute: async (client, message, args, prefix) => {

    let user = message.mentions.users.first() || client.users.cache.get(args[0])

    try {
      let avatar
      if (user) {
        avatar = await loadImage(
          user.displayAvatarURL({ format: "jpg" })
        );

      } else if (message.attachments.size > 0) {
      avatar = await loadImage(message.attachments.map(x => x.url)[0])

      } else {
        user = args[0]
        if (!user) user = message.author.displayAvatarURL({ format: "jpg" })
        let com = await iuv(user)

        if (!com) {
          avatar = await loadImage(
            message.author.displayAvatarURL({ format: "jpg" })
          );

        } else if (com) {
          avatar = await loadImage(user);

        }
      }

      const canvas = createCanvas(867, 892);
      const ctx = canvas.getContext("2d");
      const background = await loadImage(
        "https://media.discordapp.net/attachments/822225367372660806/829715532038144037/lo_peor.png?width=378&height=473"
      );
      ctx.drawImage(avatar, 0, 450, 890, 400);

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        `lopeor.jpg`
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
}