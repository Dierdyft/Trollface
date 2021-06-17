const Discord = require("discord.js");
const db = require("megadb");
const snipes = new db.crearDB("Edit-snipes")
const hd = require("humanize-duration")

module.exports = {
  name: "edit-snipe",
  description: "Toma el ultimo mensaje editado del servidor",
  category: "Diversion",
  cooldown: 5,
  aliases: ["es"],
  args: false,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "",
  execute: async (client, message, args, prefix) => {

    let snipe = await snipes.obtener(message.guild.id)
    console.log(message.guild.id)

    const no_hay = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setDescription("😆 No he visto mensajes editados recientemente")
      .setColor("RED")
      .setTimestamp()
    if (!snipe) return message.channel.send(no_hay)

    const hay_snipe = new Discord.MessageEmbed()
      .setAuthor(client.users.cache.get(snipe.author).tag, client.users.cache.get(snipe.author).displayAvatarURL({ dynamic: true }))
      .addField("Antes:", snipe.antes)
      .addField("Despues:", snipe.ahora)
      .addField("Canal:", snipe.canal)
      .setFooter("Editado hace: " + hd(Date.now() - snipe.fecha, { language: "es" }))
      .setColor("YELLOW")
    message.channel.send(hay_snipe)
  }
}