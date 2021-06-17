const Discord = require("discord.js");
const level = require("../../database/models/level.js");
const DiscordXp = require("discord-xp");
const canvacord = require("canvacord");

module.exports = {
  name: "remove-recompensa",
  description: "Remueve una recompensa",
  category: "Nivelacion",
  cooldown: 10,
  aliases: ["remove-reward"],
  args: true,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  authorPermissions: "MANAGE_GUILD",
  usage: "<role | nivel>",
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
      .setTimestamp()

    if (!args[0]) {
      mal_.setDescription("🥱 Proporciona la ID de un role o nivel de una recompensa")
      return message.channel.send(mal_);
    }

    let role_add = data.roles.find(x => x.rol === args[0]) || data.roles.find(x => x.lvl === parseInt(args[0]))

    if (!role_add) {
      mal_.setDescription("🥱 El role o nivel no se encuentra registrado en las recompensas")
      return message.channel.send(mal_);
    }

    if (role_add) {
      await data.updateOne({
        $pull: { roles: { rol: role_add.rol } }
      });

      const bien_ = new Discord.MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(`😎 Se ha removido una recompensa; Nivel **${role_add.lvl}**: <@&${role_add.rol}>(${role_add.rol})`)
        .setColor("GREEN")
        .setTimestamp()

      message.channel.send(bien_);
    }
  }
};
