const Discord = require("discord.js");
const canvacord = require("canvacord");

module.exports = {
  name: "comentar",
  description: "El fijado se la come",
  category: "Diversion",
  cooldown: 5,
  aliases: ["comment"],
  args: true,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "<texto>",
  execute: async (client, message, args, prefix) => {

    try {

      let contenido
      if (args[args.length - 1] == "-oscuro") {
        contenido = args.join(" ").replace("-oscuro", "")
      } else {
        contenido = args.join(" ")
      }

      let estilo = { "-oscuro": true }

      let comentario = await canvacord.Canvas.youtube({ "avatar": message.author.displayAvatarURL({ format: "png" }), "username": message.author.username, "content": contenido, "dark": estilo[args[args.length - 1]] })

      let si = new Discord.MessageAttachment(comentario, 'Sexo.png')
      message.channel.send(si)
    } catch (e) {

      let error = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription("😆 Ha ocurrido un error: " + e.message)
        .setColor("RED")
        .setTimestamp()

      return message.channel.send(error)
    }
  }
};