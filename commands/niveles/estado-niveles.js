const Discord = require("discord.js");
const level = require("../../database/models/level.js");
const DiscordXp = require("discord-xp");
const canvacord = require("canvacord");

module.exports = {
  name: "estado-niveles",
  description: "Mira la configuracion del sistema de nivelacion del servidor",
  category: "Nivelacion",
  cooldown: 10,
  aliases: ["en", "status-leveling"],
  args: false,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  authorPermissions: "MANAGE_GUILD",
  usage: "",
  execute: async (client, message, args, prefix) => {

    let data = await level.findOne({
      Guild: message.guild.id
    });

    if (!data) data = await level.create({ Guild: message.guild.id });

    let organizar_rewards = data.roles.sort((a, b) => a.lvl - b.lvl);

    let rewards = organizar_rewards.map((v, i) => {
      return `**${i + 1}.** Nivel **${v.lvl}:** <@&${v.rol}>(${v.rol})`;
    });
    if (organizar_rewards.length < 1) rewards = "Ninguna";

    let roles_list = data.ignore_roles.map((v, i) => {
      return `**${i + 1}.** <@&${v}>(${v})`;
    });
    if (roles_list.length < 1) {
      roles_list = "Ninguno";
    }

    let canales_list = data.ignore_channel;

    if (canales_list.length < 1) {
      canales_list = "Ninguno";
    } else {
      canales_list = data.ignore_channel.map((v, i) => {
        return `**${i + 1}.** <#${v}>(${v})`;
      });
    }

    let lvlchannel = data.channel;
    if (!lvlchannel || !message.guild.channels.cache.find(x => x.id === data.channel)) {
      lvlchannel = "Ninguno";
    } else {
      lvlchannel = `<#${data.channel}>`;
    }

    let trad = { true: "Encendido", false: "Apagado" };
    const stt = new Discord.MessageEmbed()
      .setAuthor(
        "Sistema de niveles en " + message.guild.name,
        message.guild.iconURL({ dynamic: true })
      )
      .addField(
        "Experiencia",
        `**Minima:** ${data.exp_min}\n**Maxima:** ${data.exp_max}`
      )
      .addField("Recompensas", rewards)
      .addField("Roles ignorados", roles_list)
      .addField("Canales ignorados", canales_list)
      .addField(
        "Configuracion",
        `**Mensaje de nivel:** ${data.message}\n**Mensaje de role:** ${data.role_message}\n**Canal:** ${lvlchannel}\n**Sistema:** ${
        trad[data.toggle]
        }`
      )
      .setColor("BLUE");

    message.channel.send(stt);
  }
};
