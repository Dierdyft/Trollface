const Discord = require("discord.js");
const level = require("../../database/models/level.js");
const DiscordXp = require("discord-xp");

module.exports = {
  name: "up-role",
  description: "Establece el mensaje cuando un usuario suba de nivel y obtenga un role",
  category: "Nivelacion",
  cooldown: 10,
  aliases: ["ur"],
  args: false,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  authorPermissions: "MANAGE_GUILD",
  usage: "<mensaje>",
  execute: async (client, message, args, prefix) => {

    let data = await level.findOne({ Guild: message.guild.id });
    if (!data) data = await level.create({ Guild: message.guild.id });

    const mal_ = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor("RED")
      .setTimestamp();

    if (!args[0]) {
      mal_.setDescription("🥱 Proporciona el mensaje a notificar cuando un usuario obtenga una recompensa")
      mal_.addField("> Puedes usar estas variables en el mensajes:",
      "`{user.mention}` Muestra la mencion del usuario\n`{user.tag}` Muestra el nombre de usuario y tag\n`{user.name}` Muestra el nombre del usuario\n`{role}` Muestra el role de la recompensa\n`{level}` Muestra el nivel del usuario\n`{xp}` Muestra la experiencia del usuario")
      return message.channel.send(mal_);
    }

    await data.updateOne({
      Guild: message.guild.id,
      role_message: args.join(" ")
    });

    const ya = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription("😎 Se ha establecido el mensaje cuando un usuario obtenga una recompensa")
      .setColor("GREEN")
      .setTimestamp();
    message.channel.send(ya);
  }
};