const Discord = require("discord.js");
const level = require("../../database/models/level.js");
const DiscordXp = require("discord-xp");
const canvacord = require("canvacord");

module.exports = {
  name: "recompensas",
  description: "Obten la lista de recompensas por nivel",
  category: "Nivelacion",
  cooldown: 10,
  aliases: ["rewards"],
  args: false,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  usage: "",
  execute: async (client, message, args, prefix) => {

    let data = await level.findOne({ Guild: message.guild.id });
    if (!data) data = await level.create({ Guild: message.guild.id });
    
    let organizar_rewards = data.roles.sort((a, b) => a.lvl - b.lvl);

    const lol = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(
        "🥱 No hay recompensas en el servidor"
      )
      .setColor("RED")
      .setFooter("Puedes añadir recompensas con " + prefix + "add-recompensa");
    if (organizar_rewards < 1) return message.channel.send(lol);

    let rewards = organizar_rewards.map((v, i) => {
      return `**${i + 1}.** Nivel **${v.lvl}:** <@&${v.rol}>(${v.rol})`;
    });

    const embed = new Discord.MessageEmbed()
      .setAuthor(
        "Recompensas en " + message.guild.name,
        message.guild.iconURL({ dynamic: true })
      )
      .setDescription(rewards)
      .setColor("BLUE");
    message.channel.send(embed);
  }
};
