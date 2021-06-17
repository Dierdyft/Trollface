const Discord = require("discord.js");
const level = require("../../database/models/level.js");
const DiscordXp = require("discord-xp");
const canvacord = require("canvacord");

module.exports = {
  name: "ignorar-role",
  description: "Añade un role a la lista de roles ignorados, los usuarios que posean estos roles no obtendran experiencia",
  category: "Nivelacion",
  cooldown: 10,
  aliases: ["igr"],
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

    let rol = message.mentions.roles.first() || message.guild.roles.cache.find(x => x.id == args[0])

    const mal_ = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor("RED")
      .setTimestamp();

    if (!rol) {
      mal_.setDescription("🥱 Menciona o proporciona la ID de un role del servidor")
      return message.channel.send(menciona_rol);
    }

    let busca_rol = data.ignore_roles.includes(rol.id);

    if (busca_rol) {
        mal_.setDescription("🥱 El role ya se encontraba registrado en la lista de roles ignorados")
      return message.channel.send(mal_);

    } else if (!busca_rol) {
      await data.updateOne({
        Guild: message.guild.id,
        $push: { ignore_roles: rol.id }
      });

      const bien_ = new Discord.MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(`😎 Se ha añadido el role <@&${rol.id}>(${rol.id})`)
        .setColor("GREEN")
        .setTimestamp();
      message.channel.send(bien_);
      
    }
  }
};
