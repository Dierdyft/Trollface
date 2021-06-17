const Discord = require("discord.js");
const { createCanvas, loadImage, registerFont } = require('canvas')
const iuv = require("image-url-validator").default
const { fillTextWithTwemoji } = require("@canvacord/emoji-parser");
const fs = require("fs");

module.exports = {
  name: "beepbop",
  description: "Beepbop skeep bop",
  category: "Diversion",
  cooldown: 5,
  aliases: ["skeep"],
  args: true,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "<texto>",
  execute: async (client, message, args, prefix) => {

    registerFont("./fuentes/PixelGrunge.ttf", { family: "pixelGrunge" })

    const url = 'https://cdn.discordapp.com/attachments/807026989621313578/830289892219158528/beep.png'

    try {

      const canvas = createCanvas(1366, 768)
      const ctx = canvas.getContext('2d')

      const bg = await loadImage(url)
      ctx.drawImage(bg, 0, 0)
      let texto = args.join(' ')

      let textos = texto.split('')
      let texto_total = []
      let longitud_maxima = 23;
      for (let i = 0; i <= textos.length; i++) {
        texto_total.push(textos[i])
        if (i === longitud_maxima) {
          texto_total.push('\n')
          longitud_maxima = longitud_maxima + 23
        }
      }

      if (texto_total.length >= 69) {
        texto_total = texto_total.join('').slice(0, 69) + "..."
      } else {
        texto_total = texto_total.join('')
      }

      ctx.font = '49px pixelGrunge'
      ctx.fillStyle = '#421d19'
      await fillTextWithTwemoji(ctx, texto_total, 254, 576)

      let att = new Discord.MessageAttachment(canvas.toBuffer(), 'beepbop.png')
      message.channel.send(att)
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