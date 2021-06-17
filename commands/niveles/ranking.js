const Discord = require("discord.js");
const mongoose = require("mongoose")
const { MessageButton, MessageActionRow } = require('discord-buttons');

module.exports = {
  name: "ranking",
  description: "Obten las estadisticas del sistema de nivelacion de los usuarios del servidor",
  category: "Nivelacion",
  cooldown: 15,
  aliases: [],
  args: false,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  usage: "",
  execute: async (client, message, args, prefix) => {

    let db = await mongoose.createConnection(process.env.urlMongo,
      { useNewUrlParser: true, useUnifiedTopology: true })
    let levels_require = db.model("levels", require("../../database/models/levels.js"))
    let levelDB = await levels_require.find({ guildID: message.guild.id });

    const no_hay = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setDescription("<:enojao:824074400919453766> No hay usuarios con experiencia en el servidor")
      .setColor("RED")
      .setTimestamp()
    if (!levelDB || levelDB.length < 1) return message.channel.send(no_hay)

    let orden = levelDB.sort((a, b) => b.xp - a.xp)

    let filtro = orden.filter(x => client.users.cache.get(x.userID) && x.level !== 0)
    let usuario = filtro.map((v, i) => { return `**${++i}.** [${client.users.cache.get(v.userID).tag}](https://discord.gg/UehRknyWHv) • **Nivel:** ${v.level.toLocaleString()}` })
    let usuario_link = orden.filter(x => client.users.cache.get(x.userID)).map((v, i) => {
      return `${++i}. ${client.users.cache.get(v.userID).tag} • Nivel: ${v.level.toLocaleString()}`
    }).join("\n")

    let o = parseInt(args[0])
    if (!o) o = 0

    let paginas = [];
    let cantidad = 10;
    while (usuario.length > 0) {
      paginas.push(usuario.splice(0, cantidad));
    }

    if (o > paginas.length) {
      o = paginas.length - 1
    } else if (o < 1) { o = 0 }

    let u = o + 1
    let posicion = filtro.findIndex(x => x.userID === message.author.id)

    function toCardinal(num) {
      var ones = num % 10;
      var tens = num % 100;

      if (tens < 11 || tens > 13) {
        switch (ones) {
          case 1:
            return num + "st";
          case 2:
            return num + "nd";
          case 3:
            return num + "rd";
        }
      }

      return num + "th";
    }

    let atras = new MessageButton()
      .setLabel("Pagina anterior")
      .setStyle("blurple")
      .setID("atras")

    let atras_locked = new MessageButton()
      .setLabel("Pagina anterior")
      .setStyle("blurple")
      .setID("atras")
      .setDisabled(true)

    let adelante = new MessageButton()
      .setLabel("Pagina siguiente")
      .setStyle("blurple")
      .setID("adelante")

    let adelante_locked = new MessageButton()
      .setLabel("Pagina siguiente")
      .setStyle("blurple")
      .setID("adelante")
      .setDisabled(true)

    let botones = new MessageActionRow()
      .addComponent(atras)
      .addComponent(adelante)

    let botones_2 = new MessageActionRow()
      .addComponent(atras_locked)
      .addComponent(adelante)

    let botones_3 = new MessageActionRow()
      .addComponent(atras)
      .addComponent(adelante_locked)

    let botones_4 = new MessageActionRow()
      .addComponent(atras_locked)
      .addComponent(adelante_locked)

    const table = new Discord.MessageEmbed()
      .setAuthor(
        "Tabla de clasificaciones de " + message.guild.name,
        "https://media.discordapp.net/attachments/809271380059095061/846159593725231114/Jumbo.png"
      )
      .setDescription(paginas[o])
      .setFooter(`Pagina ${u}/${paginas.length} | Clasificacion: ${toCardinal(posicion + 1)}`)
      .setColor("BLUE");

    let m
    if (paginas.length == 1) {
      m = await message.channel.send({ component: botones_4, embed: table });
    } else if (o == 0) {
      m = await message.channel.send({ component: botones_2, embed: table });
    } else if (u == paginas.length) {
      m = await message.channel.send({ component: botones_3, embed: table });
    } else {
      m = await message.channel.send({ component: botones, embed: table });
    }

    const filter = (button) => button.clicker.user.id === message.author.id;
    const collector = m.createButtonCollector(filter, { time: 50000 });

    collector.on('collect', async button => {

      await button.defer()

      if (button.id == "atras") {
        table.setDescription(paginas[o -= 1])
        table.setFooter(`Pagina ${u -= 1}/${paginas.length} | Clasificacion: ${toCardinal(posicion + 1)}`)
        m.edit({ component: botones, embed: table })
      }

      if (button.id == "adelante") {
        table.setDescription(paginas[o += 1])
        table.setFooter(`Pagina ${u += 1}/${paginas.length} | Clasificacion: ${toCardinal(posicion + 1)}`)
        m.edit({ component: botones, embed: table })
      }

      if (o <= 1) {
        table.setDescription(paginas[o])
        table.setFooter(`Pagina ${u}/${paginas.length} | Clasificacion: ${toCardinal(posicion + 1)}`)
        m.edit({ component: botones_2, embed: table })
      }

      if (u >= paginas.length) {
        table.setDescription(paginas[o])
        table.setFooter(`Pagina ${u}/${paginas.length} | Clasificacion: ${toCardinal(posicion + 1)}`)
        m.edit({ component: botones_3, embed: table })
      }

    });
  }
};
