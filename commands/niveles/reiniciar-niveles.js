const Discord = require("discord.js");
const level = require("../../database/models/level.js");
const DiscordXp = require("discord-xp");
const canvacord = require("canvacord");

module.exports = {
  name: "reiniciar-niveles",
  description: "Reestablece la experiencia y niveles de los usuarios",
  category: "Nivelacion",
  cooldown: 10,
  aliases: ["rn"],
  args: false,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  authorPermissions: "MANAGE_GUILD",
  usage: "",
  execute: async (client, message, args, prefix) => {
    
    let tabla = await DiscordXp.fetchLeaderboard(message.guild.id, 5);

    let db = await mongoose.createConnection(process.env.urlMongo,
      { useNewUrlParser: true, useUnifiedTopology: true })
    let levels_require = db.model("levels", require("../../database/models/levels.js"))
    let levelDB = await levels_require.find({ guildID: message.guild.id });

    const sinXP = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(
        "🥱 No hay usuarios con experiencia en el servidor"
      )
      .setColor("RED")
      .setTimestamp();
    if (tabla.length < 1) return message.channel.send(sinXP);

    const filtro = m => m.author.id == message.author.id;
    const opciones = { time: 10000, max: 1, errors: ["time"] };

    const apta = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription("😳 ¿Estas seguro de reiniciar el sistema de niveles?")
      .setFooter("Acepta con si, o rechaza escribiendo cualquier cosa")
      .setColor("YELLOW");

    const rechazo = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription("😐 Haz cancelado el proceso de reinicio")
      .setColor("RED")
      .setTimestamp();

    const acepta = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(
        "<a:loadingmad:807848256264077313> Dame unos segundos para reiniciar el sistema"
      )
      .setColor("GREEN")
      .setTimestamp();

    const finalizado = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(
        "<:coolflus:816349131625857074> Se han reestablecido los niveles de los usuarios del servidor"
      )
      .setColor("GREEN")
      .setTimestamp();

    message.channel.send(apta);
     message.channel.awaitMessages(filtro, opciones).then(async msg => {
      if (msg.first().content.toLowerCase() !== "si") {
        return message.channel.send(rechazo);
      }
      if (msg.first().content.toLowerCase() == "si") {
        let mrg = await message.channel.send(acepta);
        
        setTimeout(async () => {
          await levelDB.deleteMany({ guildID: message.guild.id })
          mrg.edit(finalizado);
        }, 5000)
      }
    }).catch(() => {
      return message.channel.send(rechazo)
    })
  }
};
