const Discord = require("discord.js");
const { createCanvas, loadImage } = require('canvas')

module.exports = {
  name: "amogus",
  description: "When the impostor is sus",
  category: "Diversion",
  cooldown: 5,
  aliases: [],
  args: false,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "<usuario>",
  execute: async (client, message, args, prefix) => {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author

    try {

      const avatar = await loadImage(
        user.displayAvatarURL({ format: "png" })
      );
      const canvas = createCanvas(867, 892);
      const ctx = canvas.getContext("2d");
      const background = await loadImage(
        "https://cdn.discordapp.com/attachments/802613142751805471/829448447303221327/amogus_rap_editado.png"
      );
      ctx.drawImage(avatar, 270, 100, 270, 250);

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        `amogus.jpg`
      );

      message.channel.send(attachment);

    } catch (e) {

      let error = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription("😆 Ha ocurrido un error: " + e.message)
        .setColor("RED")
        .setTimestamp()

      return message.channel.send(error)
    }
  }
}
