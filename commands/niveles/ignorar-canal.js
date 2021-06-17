const Discord = require("discord.js");
const level = require("../../database/models/level.js");
const DiscordXp = require("discord-xp");
const canvacord = require("canvacord");

module.exports = {
  name: "ignorar-canal",
  description: "Añade un canal a la lista de canales ignorados del servidor, ahi no se obtendra experiencia",
  category: "Nivelacion",
  cooldown: 10,
  aliases: ["igc"],
  args: true,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  authorPermissions: "MANAGE_GUILD",
  usage: "<canal>",
  execute: async (client, message, args, prefix) => {

    let data = await level.findOne({
      Guild: message.guild.id
    });
    if (!data) data = await level.create({ Guild: message.guild.id });

    let canal = message.mentions.channels.first() || client.channels.cache.get(args[0])

    const mal_ = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor("RED")
      .setTimestamp();

    if (!canal) { 
      mal_.setDescription("🥱 Menciona o proporciona la ID de un canal del servidor")
      return message.channel.send(mal_)
    }

    if (!message.guild.channels.cache.get(canal.id)) return message.channel.send(mal_);

    let busca_canal = data.ignore_channel.includes(canal.id);

    if (busca_canal) {
        mal_.setDescription("🥱 El canal ya se encontraba registrado en la lista de canales ignorados")
      return message.channel.send(mal_);

    } else if (!busca_canal) {
      await data.updateOne({
        Guild: message.guild.id,
        $push: { ignore_channel: canal.id }
      });

      const bien_ = new Discord.MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(`😎 Se ha añadido el canal <#${canal.id}>(${canal.id})`)
        .setColor("GREEN")
        .setTimestamp();
      message.channel.send(bien_);

    }
  }
};
