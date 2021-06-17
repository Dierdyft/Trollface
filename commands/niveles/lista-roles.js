const Discord = require("discord.js");
const level = require("../../database/models/level.js");
const DiscordXp = require("discord-xp");
const canvacord = require("canvacord");

module.exports = {
  name: "lista-roles",
  description: "Obten la lista de roles ignorados, usuarios que tengan estos roles no ganaran experiencia",
  category: "Nivelacion",
  cooldown: 10,
  aliases: ["lr"],
  args: false,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  authorPermissions: "MANAGE_GUILD",
  usage: "",
  execute: async (client, message, args, prefix) => {

    let data = await level.findOne({ Guild: message.guild.id });
    if (!data) data = await level.create({ Guild: message.guild.id });

    let organizar_rewards = data.ignore_roles.map((v, i) => {
      return `**${i + 1}.** ${message.guild.roles.resolve(v).toString()} | ${v}`;
    });

    const mal_ = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor("RED")
      .setTimestamp()

    if (organizar_rewards < 1) {
      mal_.setDescription("🥱 No hay roles registrados en la lista de roles ignorados")
      return message.channel.send(mal_);
    }

    const embed = new Discord.MessageEmbed()
      .setAuthor(
        "Lista de roles ignorados en " + message.guild.name,
        message.guild.iconURL({ dynamic: true })
      )
      .setDescription(organizar_rewards)
      .setColor("BLUE");
    message.channel.send(embed);
    
  }
};
