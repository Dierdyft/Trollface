const Discord = require("discord.js");
const ytsr = require("ytsr");
const ytdl = require("ytdl-core")
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "descargar-video",
  description: "Descarga un video de youtube por busqueda o enlace",
  category: "Diversion",
  cooldown: 50,
  aliases: ["download-video", "dv"],
  args: false,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "<busqueda | enlace>",
  execute: async (client, message, args, prefix) => {

    let query = args.join(" ");

    const error = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setColor("RED")
      .setTimestamp()
      
    try {

      let res = await ytsr(query);
      let video = res.items.filter(i => i.type === "video")

      if (video.length < 1) {
        error.setDescription("😆 No se encontraron video relacionados con tu busqueda")
        return message.channel.send(error)
      }

      let videos = video.map((v, i) => { return `**${i + 1}.** [${v.title}](${v.url}) • **Duracion:** ${v.duration}` })

      let paginas = [];
      let cantidad = 10;
      while (videos.length > 0) {
        paginas.push(videos.splice(0, cantidad));
      }

      message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
          .setDescription(paginas[1 - 1])
          .setColor("BLUE")
          .setFooter("Videos relacionados con tu busqueda, escribe el numero del video para descargarlo\nSi no eliges en 10 segundos, se cancelara la descarga")
      ).then(x => {
        x.channel.awaitMessages(m => m.author.id == message.author.id, { time: 10000, max: 1, errors: ["time"] }).then(async y => {

          let n = parseInt(y.first().content)

          if (isNaN(n) || n > 10 || n < 1) {
            error.setDescription("Se ha detenido la descarga")
            return x.edit(error)
          }

          video = video[n - 1]
          let duracion = await ytdl.getInfo(video.url)
          if (duracion.videoDetails.lengthSeconds > 600) {
            error.setDescription("😆 No puedes descargar video mayores a 10 minutos")
            return x.edit(error)
          }
          await ytdl(video.url)
            .pipe(fs.createWriteStream(`${video.views}.mp4`));

          x.edit("Haciendo peticiones a la API...")

          let limite = message.guild.premiumTier
          if (limite == 0 || limite == 1) {
            limite = "8 MB"
          } else if (limite == 2) {
            limite = "50 MB"
          } else if (limite == 3) {
            limite = "100 MB"
          }

          setTimeout(async () => {

            let video_descargado = new Discord.MessageAttachment(`./${video.views}.mp4`, "video.mp4")
            await message.channel.send(`${video.title}`, video_descargado).catch(e => {

              return x.edit(
                new Discord.MessageEmbed()
                  .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                  .setDescription("😆 No puedo enviar videos mayores a " + limite)
                  .setColor("RED")
                  .setTimestamp()
              )
            })
            fs.unlinkSync(`./${video.views}.mp4`)

          }, 10000)
        }).catch(e => {
          error.setDescription("😆 Se ha detenido la descarga")
          return x.edit(error)
        })
      })

    } catch (e) {

      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
          .setDescription("😆 Ha ocurrido un error: " + e.message)
          .setColor("RED")
          .setTimestamp()
      )

    }
  }
};
