const Discord = require("discord.js");
const level = require("../../database/models/level.js");
const DiscordXp = require("discord-xp");
const canvacord = require("canvacord");

module.exports = {
  name: "up-recompensa",
  description: "Establece el mensaje cuando un usuario suba de nivel y obtenga una recompensa",
  category: "Nivelacion",
  cooldown: 10,
  aliases: ["ur", "up-reward"],
  args: false,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  authorPermissions: "MANAGE_GUILD",
  usage: "<mensaje>",
  execute: async (client, message, args, prefix) => {

    let data = await level.findOne({ Guild: message.guild.id });
    if (!data) data = await level.create({ Guild: message.guild.id });

    const elMensaje = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(
        "<:coolduerme:811087907891970089> Establece el mensaje cuando las personas ganen un role de las recompensas"
      )
      .setColor("RED")
      .setTimestamp();
    if (!args[0]) return message.channel.send(elMensaje);

    await data.updateOne({
      Guild: message.guild.id,
      role_message: args.join(" ")
    });

    const ya = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription("😎 Se ha establecido el mensaje cuando un usuario consiga una recompensa")
      .setColor("GREEN")
      .setTimestamp();
    message.channel.send(ya);
  }
};