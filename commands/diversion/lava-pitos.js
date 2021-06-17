const Discord = require("discord.js");
const { createCanvas, loadImage, registerFont } = require('canvas')
const { fillTextWithTwemoji } = require("@canvacord/emoji-parser");
const fs = require("fs");

module.exports = {
  name: "lava-pitos",
  description: "Se lavan pitos a domicilios",
  category: "Diversion",
  cooldown: 5,
  aliases: ["lavapitos"],
  args: true,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "<usuario>",
  execute: async (client, message, args, prefix) => {

    try {

      registerFont("./fuentes/arial.ttf", { family: "arial" })

      const canvas = createCanvas(700, 606);
      const ctx = canvas.getContext("2d");
      const background = await loadImage(
        "https://cdn.discordapp.com/attachments/820770466373173289/834811303880032296/pito.png"
      );

      let avatar
      let nombre
      let status
      if (message.mentions.users.size > 0) {
        avatar = message.mentions.users.first().displayAvatarURL({ format: "png" })
        nombre = message.mentions.users.first().tag
        status = message.mentions.users.first().presence.status

      } else if (client.users.cache.get(args[0])) {
        avatar = client.users.cache.get(args[0]).displayAvatarURL({ format: "png" })
        nombre = client.users.cache.get(args[0]).tag
        status = client.users.cache.get(args[0]).presence.status

      } else {
        let busca_user = await client.users.fetch(args[0])
        avatar = busca_user.displayAvatarURL({ format: "png" })
        nombre = busca_user.tag
        status = "offline"

      }
      let img = await loadImage(avatar)

      if (status == "online") {
        status = "#008F39"
      } else if (status == "dnd") {
        status = "#ff000"
      } else if (status == "idle") {
        status = "#F8F32B"
      } else if (status == "offline") {
        status = "#9C9C9C"
      }
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.font = '45px arial'
      ctx.fillStyle = '#ff0000'
      ctx.textAlign = 'center'
      //ctx.fillText(nombre, 320, 355)
await fillTextWithTwemoji(ctx, nombre, 320, 355)

      ctx.beginPath();
      ctx.arc(320, 470, 100, 0, Math.PI * 2);
      ctx.fillStyle = status
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 220, 370, 200, 200);

      const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        `maricon.jpg`
      );
      message.channel.send(attachment);

    } catch (e) {

      const error = new Discord.MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(
          "😆 Ha ocurrido un error: " + e.message
        )
        .setColor("RED")
        .setTimestamp();
      return message.channel.send(error);
    }
  }
}