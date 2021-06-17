const Discord = require("discord.js");
const level = require("../../database/models/level.js");
const DiscordXp = require("discord-xp");
const canvacord = require("canvacord");

module.exports = {
  name: "remove-canal",
  description: "Remueve un canal de la lista de canales ignorados",
  category: "Nivelacion",
  cooldown: 10,
  aliases: ["rc"],
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

    const mal_ = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor("RED")
      .setTimestamp();

    if (!args[0]) {
      mal_.setDescription("🥱 Proporciona la ID de un canal a remover de la lista de canales ignorados")
      return message.channel.send(mal_)
    }

    let busca_canal = data.ignore_channel.includes(args[0]);

    if (!busca_canal) {
        mal_.setDescription("🥱 El canal no se encuentra registrado en la lista de canales ignorados")
      return message.channel.send(mal_);

    } else if (busca_canal) {
      await data.updateOne({
        Guild: message.guild.id,
        $pull: { ignore_channel: args[0] }
      });

      const bien_ = new Discord.MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(`😎 Se ha removido el canal <#${args[0]}>(${args[0]})`)
        .setColor("GREEN")
        .setTimestamp();
      message.channel.send(bien_);

    }
  }
};
