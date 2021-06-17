const Discord = require("discord.js");
const { createCanvas, loadImage } = require('canvas')
const iuv = require("image-url-validator").default

module.exports = {
  name: "whatsapp",
  description: "*Suena sonido de whatsapp*",
  category: "Diversion",
  cooldown: 5,
  aliases: ["wa"],
  args: false,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "<usuario | enlace | attachment>",
  execute: async (client, message, args, prefix) => {

    let user = message.mentions.users.first() || client.users.cache.get(args[0])

    try {

      let avatar
      if (user) {
        avatar = await loadImage(
          user.displayAvatarURL({ format: "png" })
        );
      } else if (message.attachments.size > 0) {
      avatar = await loadImage(message.attachments.map(x => x.url)[0])
      } else {
        user = args[0]
        if (!user) user = message.author.displayAvatarURL({ format: "png" })
        let com = await iuv(user)
        if (!com) {
          avatar = await loadImage(
            message.author.displayAvatarURL({ format: "png" })
          );
        } else if (com) {
          avatar = await loadImage(user);
        }
      }

      const canvas = createCanvas(800, 800);
      const ctx = canvas.getContext("2d");
      const background = await loadImage(
        "https://cdn.discordapp.com/attachments/821168411978629120/830951165943480359/whatsapp.png"
      );
      ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        `wasap.jpg`
      );

      message.channel.send(attachment);

    } catch (e) {

      let error = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription("<:XD:804920471698145320> Ha ocurrido un error: " + e.message)
        .setColor("RED")
        .setTimestamp()
      return message.channel.send(error)
    }
  }
}