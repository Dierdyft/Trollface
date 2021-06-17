const Discord = require("discord.js");
const { createCanvas, loadImage, registerFont } = require('canvas')
const iuv = require("image-url-validator").default
const { fillTextWithTwemoji } = require("@canvacord/emoji-parser");
const fs = require("fs");

module.exports = {
  name: "desmotivacion",
  description: "Cuadro tipico de la pagina desmotivaciones.com",
  category: "Diversion",
  cooldown: 5,
  aliases: ["cuadro"],
  args: false,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "<texto> | <texto>",
  execute: async (client, message, args, prefix) => {

    const mal_ = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setColor("RED")
      .setTimestamp()

    registerFont("./fuentes/timesbd.ttf", { family: "timesbd" })
    registerFont("./fuentes/comic.ttf", { family: "comic" })

    let img = args[0]
    if (!img) {
      const exp = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .addField("Metodo de uso por medio de la ultima imagen enviada en el canal o por un archivo adjunto", `${prefix}desmotivacion Camello tactico | Joder encima tactico`)
        .addField("Metodo de uso por medio de enlace", `${prefix}desmotivacion <enlace> Camello tactico | Joder encima tactico`)
        .setColor("RED")
        .setFooter("Recuerda que cuando pongas | el texto que sigue ira debajo del titulo")
      return message.channel.send(exp)
    }
    let texto = args.slice(1).join(' ').split(" | ")

    try {

      if (img) {

        let url = await iuv(img)
        if (!url) {
          img = await message.channel.messages.fetch({ limit: 100 })

          img = img.filter(x => x.attachments.size > 0).first().attachments.map(x => x.url)[0]

          texto = args.join(" ").split(" | ")
        } else if (url) {
          if (!args[1]) {
            mal_.setDescription("😆 Proporciona un mensaje para convertirlo en un cuadro de desmotivacion")
            mal_.addField("Ejemplo:", `${prefix}desmotivacion Camello tactico | Joder encima tactico`)
            return message.channel.send(mal_)
          }
        }
      }

      const canvas = createCanvas(650, 505)
      const ctx = canvas.getContext('2d')

      let imagen = await loadImage(img)
      let fondo = await loadImage("https://cdn.discordapp.com/attachments/811999869115039794/831929756248309770/desmotivaciones.png")

      if (texto[0].length > 32) {
        mal_.setDescription("😆 No puedes poner un titulo superior a 32 caracteres")
        return message.channel.send(mal_)
      }

      ctx.drawImage(imagen, 30, 30, 590, 350)
      ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height)

      if (texto[1]) {
        let textos = texto[1].split('')
        let texto_total = []
        let longitud_maxima = 50;
        for (let i = 0; i <= textos.length; i++) {
          texto_total.push(textos[i])
          if (i === longitud_maxima) {
            texto_total.push('\n')
            longitud_maxima = longitud_maxima + 25
          }
        }
        ctx.font = '20px comic'
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'
        //ctx.fillText(texto_total.join(""), 325, 460)
        await fillTextWithTwemoji(ctx, texto_total.join(""), 325, 460)

      }

      ctx.font = '40px timesbd'
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      //ctx.fillText(texto[0], 325, 425)
      await fillTextWithTwemoji(ctx, texto[0], 325, 425)

      let att = new Discord.MessageAttachment(canvas.toBuffer(), 'desmotivacion.png')
      message.channel.send(att)

    } catch (err) {

      mal_.setDescription("😆 Ha ocurrido un error: " + err.message)
      return message.channel.send(mal_)
    }
  }
}