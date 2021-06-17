const Discord = require("discord.js");
const hd = require("humanize-duration");
const db = require("quick.db")

module.exports = {
  name: "zzz",
  description: "Duerme duerme xdXDxDxd",
  category: "Diversion",
  cooldown: 5,
  aliases: ["afk"],
  args: false,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  usage: "<razon>",
  execute: async (client, message, args, prefix) => {

    const status = new db.table("AFKs")
    let afk = await status.fetch(message.author.id)

    let razon = args.join(" ")
    if (!razon) razon = "???"

    if (!afk) {
      const zzz = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription("<:gatozzz:828128260751097876> Te haz echado a dormir por **" + razon + "**")
        .setColor("BLUE")
        .setTimestamp()

      status.set(message.author.id, { por: razon, hora: Date.now() })
      message.channel.send(zzz)

    } else {
      const ya = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription("<:gatozzz:828128260751097876> Ya despertaste del sueño")
        .setColor("BLUE")
        .setTimestamp()

      status.delete(message.author.id)
      message.channel.send(ya)
    }
  }
}