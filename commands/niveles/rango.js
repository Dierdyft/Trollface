const Discord = require("discord.js");
const level = require("../../database/models/level.js");
const DiscordXp = require("discord-xp");
const canvacord = require("canvacord");
const mongoose = require("mongoose")

module.exports = {
  name: "rango",
  description: "Obten las estadisticas del sistema de nivelacion, puedes ser tu u otro usuario",
  category: "Nivelacion",
  cooldown: 10,
  aliases: ["rank"],
  args: false,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  usage: "<usuario>",
  execute: async (client, message, args, prefix) => {

    const user = message.mentions.users.first() || message.author;

    const userXp = await DiscordXp.fetch(user.id, message.guild.id);

    const mal_ = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor("RED")
      .setTimestamp();

    if (!userXp) {
      mal_.setDescription("🥱 No tienes experiencia en el servidor")
      return message.channel.send(mal_);
    }

    const needXp = DiscordXp.xpFor(parseInt(userXp.level + 1));

    let DB = await mongoose.createConnection(process.env.urlMongo,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => { })
    let levels_require = DB.model("levels", require("../../database/models/levels.js"))
    let levelDB = await levels_require.find({ guildID: message.guild.id });
    let orden = levelDB.sort((a, b) => b.xp - a.xp)
    let usuario = orden.filter(x => client.users.cache.get(x.userID) && x.level !== 0)
    let posicion = orden.findIndex(x => x.userID === user.id)

    const rank = new canvacord.Rank()
      .setAvatar(user.displayAvatarURL({ dynamic: false, format: "png" }))
      .setRank(posicion + 1, "Clasificacion", true)
      .setCurrentXP(userXp.xp)
      .setLevel(userXp.level, "Nivel", true)
      .setRequiredXP(needXp)
      .setCustomStatusColor("#FFFF00")
      .setProgressBar("#FFFF00", "COLOR")
      .setUsername(user.username)
      .setDiscriminator(user.discriminator)
    rank.build()
      .then(data => {
        const attachment = new Discord.MessageAttachment(data, "clasificacion.png");
        message.channel.send(attachment);
      });
  }
};
