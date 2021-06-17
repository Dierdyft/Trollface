const Discord = require("discord.js");
const level = require("../../database/models/level.js");
const DiscordXp = require("discord-xp");
const canvacord = require("canvacord");

module.exports = {
  name: "up-canal",
  description: "Establece el canal donde se notificara si un usuario llega a un nivel o consigue una recompensa",
  category: "Nivelacion",
  cooldown: 10,
  aliases: ["uc", "up-channel"],
  args: true,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  authorPermissions: "MANAGE_GUILD",
  usage: "<canal>",
  execute: async (client, message, args, prefix) => {
    
    const canal = message.mentions.channels.first() || client.channels.cache.get(args[0])

    const mal_ = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor("RED")
      .setTimestamp();

    if (!canal || !message.guild.channels.cache.get(canal.id)) {
      mal_.setDescription("🥱 Menciona o proporciona la ID de un canal donde se notificara cuando un usuario suba de nivel")
      return message.channel.send(mal_);
    }
    
    let data = await level.findOne({
      Guild: message.guild.id 
    }) 
    
    if(!data) data = await level.create({Guild: message.guild.id}) 
    
    await data.updateOne({
      Guild: message.guild.id, 
      channel: canal.id
    }) 
    
    const bien_ = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(`😎 Se ha establecido el canal <#${canal.id}>(${canal.id})`)
      .setColor("GREEN")
      .setTimestamp();

    message.channel.send(bien_) 
  }
};
