const Discord = require("discord.js");
const db = require("megadb");
const snipes = new db.crearDB("mensajes")
const hd = require("humanize-duration")
const { MessageButton, MessageActionRow } = require('discord-buttons');

module.exports = {
  name: "snipe",
  description: "Obten el ultimo mensaje borrado del servidor",
  category: "Diversion",
  cooldown: 5,
  aliases: ["ms"],
  args: false,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  usage: "",
  execute: async (client, message, args, prefix) => {

    let snipe = await snipes.obtener(message.guild.id) || []

    const no_hay = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setDescription("😆 No he visto mensajes borrados recientemente")
      .setColor("RED")
      .setTimestamp()
    if (!snipe.length) return message.channel.send(no_hay)

    let i = 0
    let I = i + 1

    let paginas = [];
    let cantidad = 1;
    while (snipe.length > 0) {
      paginas.push(snipe.splice(0, cantidad));
    }

    let data = paginas[i][0]

    let atras = new MessageButton()
      .setLabel("Pagina anterior")
      .setStyle("green")
      .setID("atras")

    let atras_locked = new MessageButton()
      .setLabel("Pagina anterior")
      .setStyle("green")
      .setID("atras")
      .setDisabled(true)

    let adelante = new MessageButton()
      .setLabel("Pagina siguiente")
      .setStyle("green")
      .setID("adelante")

    let adelante_locked = new MessageButton()
      .setLabel("Pagina siguiente")
      .setStyle("green")
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

    let SnipeEmbed = new Discord.MessageEmbed()
      .setAuthor(client.users.cache.get(data.author).tag, client.users.cache.get(data.author).displayAvatarURL({ dynamic: true }))
      .setDescription(`Mensaje borrado en ${data.canal}\n` + data.contenido)
      .setImage(data.imagen)
      .setColor("GREEN")
      .setFooter(`Hace ${hd(Date.now() - data.fecha, { language: "es", round: true, conjunction: " y ", serialComma: false })} | Pagina ${I}/${paginas.length}`)

    let m
    if (paginas.length == 1) {
      m = await message.channel.send({ component: botones_4, embed: SnipeEmbed });
    } else if (i == 0) {
      m = await message.channel.send({ component: botones_2, embed: SnipeEmbed });
    } else if (i == paginas.length) {
      m = await message.channel.send({ component: botones_3, embed: SnipeEmbed });
    } else {
      m = await message.channel.send({ component: botones, embed: SnipeEmbed });
    }

    const filter = (button) => button.clicker.user.id === message.author.id;
    const collector = m.createButtonCollector(filter, { time: 50000 });

    collector.on('collect', async button => {

      await button.defer()

      if (button.id == "atras") {

        data = paginas[i -= 1][0]

        SnipeEmbed.setAuthor(client.users.cache.get(data.author).tag, client.users.cache.get(data.author).displayAvatarURL({ dynamic: true }))
          .setDescription(`Mensaje borrado en ${data.canal}\n` + data.contenido)
          .setImage(data.imagen)
          .setColor("GREEN")
          .setFooter(`Hace ${hd(Date.now() - data.fecha, { language: "es", round: true, conjunction: " y ", serialComma: false })} | Pagina ${I -= 1}/${paginas.length}`)
        m.edit({ component: botones, embed: SnipeEmbed })
      }

      if (button.id == "adelante") {
        data = paginas[i += 1][0]

        SnipeEmbed.setAuthor(client.users.cache.get(data.author).tag, client.users.cache.get(data.author).displayAvatarURL({ dynamic: true }))
          .setDescription(`Mensaje borrado en ${data.canal}\n` + data.contenido)
          .setImage(data.imagen)
          .setColor("GREEN")
          .setFooter(`Hace ${hd(Date.now() - data.fecha, { language: "es", round: true, conjunction: " y ", serialComma: false })} | Pagina ${I += 1}/${paginas.length}`)
        m.edit({ component: botones, embed: SnipeEmbed })
      }

      if (I <= 1) {
        data = paginas[i][0]

        SnipeEmbed.setAuthor(client.users.cache.get(data.author).tag, client.users.cache.get(data.author).displayAvatarURL({ dynamic: true }))
          .setDescription(`Mensaje borrado en ${data.canal}\n` + data.contenido)
          .setImage(data.imagen)
          .setColor("GREEN")
          .setFooter(`Hace ${hd(Date.now() - data.fecha, { language: "es", round: true, conjunction: " y ", serialComma: false })} | Pagina ${I}/${paginas.length}`)
        m.edit({ component: botones_2, embed: SnipeEmbed })
      }

      if (I >= paginas.length) {
        data = paginas[i][0]

        SnipeEmbed.setAuthor(client.users.cache.get(data.author).tag, client.users.cache.get(data.author).displayAvatarURL({ dynamic: true }))
          .setDescription(`Mensaje borrado en ${data.canal}\n` + data.contenido)
          .setImage(data.imagen)
          .setColor("GREEN")
          .setFooter(`Hace ${hd(Date.now() - data.fecha, { language: "es", round: true, conjunction: " y ", serialComma: false })} | Pagina ${I}/${paginas.length}`)
        m.edit({ component: botones_3, embed: SnipeEmbed })
      }
    })

  }
}