const Discord = require("discord.js");
const { createCanvas, loadImage, registerFont } = require('canvas')
const iuv = require("image-url-validator").default
const fetch = require("node-fetch")

module.exports = {
  name: "youtube-video",
  description: "Recrea un video",
  category: "Diversion",
  cooldown: 5,
  aliases: ["yv"],
  args: false,
  devOnly: true,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  usage: "<canal> <imagen> <texto>",
  execute: async (client, message, args, prefix) => {

    registerFont("./fuentes/Roboto-Bold.ttf", { family: "RobotoBold" })

    const mal_ = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setColor("RED")
      .setTimestamp()

    let busqueda
    let imagen
    let comp
    let canvas
    let ctx

    if (message.attachments.size > 0) {
      imagen = message.attachments.map(X => X.url)[0]
      comp = await iuv(imagen)

      if (!comp) {
        mal_.setDescription("😆 Proprociona un enlace o archivo valido")
        return message.channel.send(mal_)
      }

      busqueda = args.join(" ").split(" | ")
      if (!busqueda[0]) {
        mal_.setDescription("😆 Proprociona un canal de YouTube")
        return message.channel.send(mal_)
      }

      let CanalLink = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${busqueda[0]}&key=${process.env.YoutubeKey}&maxResults=1&type=channel`)
      let CanalJSON = await CanalLink.json()
      if (!CanalJSON || !CanalJSON.items[0]) {
        mal_.setDescription("😆 El canal proporcionado no es valido")
        return message.channel.send(mal_)
      }
      let ValidaLink = await fetch(`https://www.youtube.com/channel/${CanalJSON.items[0].id.channelId}`)

      if (ValidaLink.status !== 200) {
        mal_.setDescription("😆 El canal proporcionado no es valido")
        return message.channel.send(mal_)
      }

      if (!busqueda[1]) {
        mal_.setDescription("😆 Proporciona un titulo para el video")
        return message.channel.send(mal_)
      }

      let TextoSplit = busqueda[1].split('')
      let TextoVideo = []
      let longitud_maxima = 35;
      for (let i = 0; i <= TextoSplit.length; i++) {
        TextoVideo.push(TextoSplit[i])
        if (i === longitud_maxima) {
          TextoVideo.push('\n')
          longitud_maxima = longitud_maxima + 35
        }
      }

      canvas = createCanvas(273, 300);
      ctx = canvas.getContext("2d");

      let FondoVideo = await loadImage("https://images-ext-2.discordapp.net/external/1QhG92Sb_Q8qZztLdWf5mCw1DdKkpkPosMJsvTWV5pY/https/media.discordapp.net/attachments/850750536545337406/853469343211454474/CapturaYoutube_2.jpg?width=273&height=300")
      let ImagenVideo = await loadImage(imagen)
      let AvatarVideo = await loadImage(CanalJSON.items[0].snippet.thumbnails.high.url)
      let GrisVideo = await loadImage("https://media.discordapp.net/attachments/783016906495754240/852283727542747136/muestra.jpg?width=157&height=29")
      let FechaVideo = await loadImage("https://media.discordapp.net/attachments/842225401769230356/852399809864007710/muestra2.jpg?width=352&height=29")

      ctx.drawImage(FondoVideo, 0, 0)
      //ctx.drawImage(ImagenVideo, 0, 0, 391, 225)
      ctx.drawImage(GrisVideo, 0, 158, 250, 40)
      //ctx.drawImage(FechaVideo, 2, 270, 355, 33)

      ctx.font = '14px RobotoBold'
      ctx.fillStyle = '#fafafa'
      ctx.fillText(TextoVideo.join(""), 8, 174)

      ctx.beginPath();
      ctx.arc(33, 395, 20, 0, Math.PI * 2);
      ctx.fillStyle = "#212121"
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(AvatarVideo, 13, 375, 40, 40);

      let ImagenHecha = new Discord.MessageAttachment(canvas.toBuffer(), "YouTube.jpg");
      message.channel.send(ImagenHecha);

    } else if (args[0]) { //Links o enlaces xdxdXD
      comp = await iuv(args[0])

      if (!comp) {
        mal_.setDescription("😆 Proprociona un enlace o archivo valido")
        return message.channel.send(mal_)
      }
      busqueda = args.slice(1).join(" ").split(" | ")

      if (!busqueda[0]) {
        mal_.setDescription("😆 Proprociona un canal de YouTube")
        return message.channel.send(mal_)
      }

      let CanalLink = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${busqueda[0]}&key=${process.env.YoutubeKey}&maxResults=1&type=channel`)
      let CanalJSON = await CanalLink.json()
      console.log(CanalJSON)
      if (!CanalJSON || !CanalJSON.items[0]) {
        mal_.setDescription("😆 El canal proporcionado no es valido")
        return message.channel.send(mal_)
      }
      let ValidaLink = await fetch(`https://www.youtube.com/channel/${CanalJSON.items[0].id.channelId}`)

      if (ValidaLink.status !== 200) {
        mal_.setDescription("😆 El canal proporcionado no es valido")
        return message.channel.send(mal_)
      }

      let TextoSplit = busqueda[1].split('')
      let TextoVideo = []
      let longitud_maxima = 35;
      for (let i = 0; i <= TextoSplit.length; i++) {
        TextoVideo.push(TextoSplit[i])
        if (i === longitud_maxima) {
          TextoVideo.push('\n')
          longitud_maxima = longitud_maxima + 35
        }
      }
      if (TextoVideo.length >= 74) {
        TextoVideo = TextoVideo.join('').slice(0, 74) + "..."
      } else {
        TextoVideo = TextoVideo.join('')
      }

      let FondoVideo = await loadImage("https://media.discordapp.net/attachments/841159103224479794/851991525792546816/IMG_20210608_200650.jpg?width=391&height=427")
      let ImagenVideo = await loadImage(imagen)
      let AvatarVideo = await loadImage(CanalJSON.items[0].snippet.thumbnails.high.url)
      let GrisVideo = await loadImage("https://media.discordapp.net/attachments/783016906495754240/852283727542747136/muestra.jpg?width=157&height=29")

      ctx.drawImage(FondoVideo, 0, 0, 391, 427)
      ctx.drawImage(ImagenVideo, 0, 0, 391, 225)
      ctx.drawImage(GrisVideo, 0, 228, 355, 33)

      ctx.font = '17px RobotoBold'
      ctx.fillStyle = '#fafafa'
      ctx.fillText(TextoVideo, 14, 257)

      ctx.beginPath();
      ctx.arc(33, 395, 20, 0, Math.PI * 2);
      ctx.fillStyle = "#212121"
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(AvatarVideo, 12, 375, 40, 40);

      let ImagenHecha = new Discord.MessageAttachment(canvas.toBuffer(), "YouTube.jpg");
      message.channel.send(ImagenHecha);

    } else {
      mal_.setDescription("😆 Proprociona un enlace o archivo")
      return message.channel.send(mal_)
    }
  }
}