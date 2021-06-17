const Discord = require("discord.js");
const { createCanvas, loadImage } = require('canvas')
const iuv = require("image-url-validator").default

module.exports = {
  name: "un-amigo",
  description: "Tu amigo tiene cancer",
  category: "Diversion",
  cooldown: 5,
  aliases: ["unamigo"],
  args: false,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "<usuario | enlace>",
  execute: async (client, message, args, prefix) => {

    try {

      let user = message.mentions.users.first() || client.users.cache.get(args[0])

      let avatar
      if (user) {
        avatar = await loadImage(
          user.displayAvatarURL({ format: "jpg" })
        );
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

      const canvas = createCanvas(674, 1200); //867 892
      const ctx = canvas.getContext("2d");
      const background = await loadImage(
        "https://cdn.discordapp.com/attachments/802613142751805471/829797320299774024/un_amigo.png"
      );
      ctx.drawImage(avatar, 150, -70, 500, 500);
      ctx.drawImage(avatar, 18, 28, 100, 100);
      ctx.drawImage(avatar, 260, 450, 100, 100);

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        `whatsapp.jpg`
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