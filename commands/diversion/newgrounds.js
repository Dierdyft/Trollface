const Discord = require("discord.js");
const fetch = require("node-fetch")

module.exports = {
  name: "newgrounds",
  description: "newgrounds",
  category: "Diversion",
  cooldown: 30,
  aliases: ["ng"],
  args: true,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "<cancionID>",
  execute: async (client, message, args, prefix) => {

    let limite = message.guild.premiumTier
    if (limite == 0 || limite == 1) {
      limite = "8 MB"
    } else if (limite == 2) {
      limite = "50 MB"
    } else if (limite == 3) {
      limite = "100 MB"
    }

    const res = await fetch(`https://newgrounds.com/audio/download/${args[0]}`)

    if (res.status !== 200) return message.channel.send(new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setDescription("😆 La cancion no existe o el autor no permite descargarla")
      .setColor("RED")
      .setTimestamp()
    )

    message.channel.send({ files: [{ attachment: await res.buffer(), name: "audio.mp3" }] }).catch(e => {

      message.channel.send(new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription("😆 No puedo enviar videos mayores a " + limite)
        .setColor("RED")
        .setTimestamp()
      )
    })
  }
}