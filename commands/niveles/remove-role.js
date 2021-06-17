const Discord = require("discord.js");
const level = require("../../database/models/level.js");
const DiscordXp = require("discord-xp");

module.exports = {
  name: "remove-role",
  description: "Remueve un role de la lista de roles ignorados",
  category: "Nivelacion",
  cooldown: 10,
  aliases: [],
  args: true,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  authorPermissions: "MANAGE_GUILD",
  usage: "<role>",
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
      mal_.setDescription("🥱 Proporciona la ID de un role a remover de la lista de canales role")
      return message.channel.send(mal_)
    }

    let busca_rol = data.ignore_roles.includes(args[0]);

    if (!busca_rol) {
        mal_.setDescription("🥱 El role no se encuentra registrado en la lista de canales roles")
      return message.channel.send(mal_);

    } else if (busca_rol) {
      await data.updateOne({
        Guild: message.guild.id,
        $pull: { ignore_roles: args[0] }
      });

      const bien_ = new Discord.MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(`😎 Se ha removido el role <#${args[0]}>(${args[0]})`)
        .setColor("GREEN")
        .setTimestamp();
      message.channel.send(bien_);

    }
  }
};
