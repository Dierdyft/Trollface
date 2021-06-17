const Discord = require("discord.js");
const level = require("../../database/models/level.js");
const DiscordXp = require("discord-xp");

module.exports = {
  name: "exp-maxima",
  description: "Establece la experiencia maxima",
  category: "Nivelacion",
  cooldown: 10,
  aliases: ["exp-max"],
  args: true,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  authorPermissions: "MANAGE_GUILD",
  usage: "<experiencia>",
  execute: async (client, message, args, prefix) => {

    let data = await level.findOne({
      Guild: message.guild.id
    });
    if (!data) data = await level.create({ Guild: message.guild.id });

    const mal_ = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor("RED")
      .setTimestamp();

    if (!args[0] || isNaN(args[0])) {
      mal_.setDescription("🥱 Establece la experiencia maxima a otorgar por mensajes")
      return message.channel.send(mal_)
    }

    if (parseInt(args[0]) > 50) {
      mal_.setDescription("🥱 El limite de experiencia maxima es de 50")
      return message.channel.send(mal_)
    }

    if (parseInt(args[0]) < data.exp_min) {
      mal_.setDescription("🥱 La experiencia maxima no puede ser menor a " + data.exp_min + ", que es la experiencia minima")
      return message.channel.send(mal_);
    }

    await data.updateOne({
      Guild: message.guild.id,
      exp_max: parseInt(args[0])
    });

    const bien_ = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription("😎 La experiencia maxima otorgada fue establecida a " + args[0])
      .setColor("GREEN")
      .setTimestamp();
    message.channel.send(bien_);
  }
};
