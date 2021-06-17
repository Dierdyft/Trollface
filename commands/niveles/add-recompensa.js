const Discord = require("discord.js");
const level = require("../../database/models/level.js");
const DiscordXp = require("discord-xp");
const canvacord = require("canvacord");

module.exports = {
  name: "add-recompensa",
  description: "Añade una recompensa con un role y nivel, cuando un usuario llegue a ese nivel se le otorgara el role",
  category: "Nivelacion",
  cooldown: 10,
  aliases: ["add-reward"],
  args: false,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  authorPermissions: "MANAGE_GUILD",
  usage: "<role> <nivel>",
  execute: async (client, message, args, prefix) => {

    let data = await level.findOne({
      Guild: message.guild.id
    })
    if (!data) data = await level.create({ Guild: message.guild.id })

    const roll = message.mentions.roles.first() || message.guild.roles.cache.find(c => c.id == args[0])

    const mal_ = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor("RED")
      .setTimestamp();

    if (!roll) {
      mal_.setDescription("🥱 Menciona o proporciona la ID de un role junto con el nivel a otorgarse")
      return message.channel.send(mal_)
    }

    if (!roll.editable) {
      mal_.setDescription("🥱 Mi role se encuentra debajo del role a otorgar")
      return message.channel.send(mal_)
    }

    if (!args[1] || isNaN(args[1])) {
      mal_.setDescription("🥱 Especifica en que nivel va a ser otorgado")
      return message.channel.send(mal_)
    }

    if (parseInt(args[1]) < 1 || parseInt(args[1]) > 100) {
      mal_.setDescription("🥱 No puedo otorgar recompensas con niveles mayor a 100")
      return message.channel.send(mal_)
    }

    let role_add = data.roles.find(x => x.rol == roll.id);

    if (role_add) {
      mal_.setDescription("🥱 Ya hay una recompensa con el role que quieres otorgar")
      return message.channel.send(mal_)
    }

    let lvl_add = data.roles.find(x => x.lvl == parseInt(args[1]));

    if (lvl_add) {
      mal_.setDescription("🥱 Ya hay un recompensa con el nivel a ser otorgado")
      return message.channel.send(mal_)
    }

    const bien_ = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(`😎 Se ha añadido una recompensa; Nivel **${args[1]}**: <@&${roll.id}>(${roll.id})`)
      .setColor("GREEN")
      .setTimestamp();

    if (data) {

      data.roles.unshift({
        rol: roll.id,
        lvl: parseInt(args[1])
      });
      data.save();
      message.channel.send(bien_)
    } else if (!data) {

      let newData = new level({
        Guild: message.guild.id,
        roles: [
          {
            rol: roll.id,
            lvl: parseInt(args[1])
          }
        ]
      });
      newData.save();
      message.channel.send(bien_)
    }
  }
}

