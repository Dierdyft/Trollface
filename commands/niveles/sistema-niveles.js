const Discord = require("discord.js");
const level = require("../../database/models/level.js");

module.exports = {
  name: "sistema-niveles",
  description: "Activa o desactiva el sistema de niveles",
  category: "Nivelacion",
  cooldown: 10,
  aliases: ["sn", "system-levels"],
  args: true,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  authorPermissions: "MANAGE_GUILD",
  usage: "<on | off>",
  execute: async (client, message, args, prefix) => {

    let data = await level.findOne({ Guild: message.guild.id });
    if (!data) data = await level.create({ Guild: message.guild.id });

    const mal_ = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor("RED")
      .setTimestamp();

    const bien_ = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor("GREEN")
      .setTimestamp();

    if (!args[0] || !["on", "off"].includes(args[0].toLowerCase())) {
      mal_.setDescription("🥱 Activa el sistema de niveles con `on` o desactivalo con `off`")
      return message.channel.send(mal_);
    }

    if (args[0].toLowerCase() == "on") {

      if (data.toggle == true) {
        mal_.setDescription("🥱 El sistema de niveles ya se encontraba activado")
        return message.channel.send(mal_);
      }

      await data.updateOne({
        Guild: message.guild.id,
        toggle: true
      });

      bien_.setDescription("😎 El sistema de niveles ha sido activado")
      message.channel.send(bien_);
    }

    if (args[0].toLowerCase() == "off") {

      if (data.toggle == false) {
        mal_.setDescription("🥱 El sistema de niveles ya se encontraba desactivado")
        return message.channel.send(mal_);
      }

      await data.updateOne({
        Guild: message.guild.id,
        toggle: false
      });

      bien_.setDescription("😎 El sistema de niveles ha sido desactivado")
      message.channel.send(bien_);
    }
  }
};
