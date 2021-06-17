const Discord = require("discord.js");
const pet = require('pet-pet-gif')
const { parse } = require("twemoji-parser");
const svg2img = require("node-svg2img");
const iuv = require("image-url-validator").default

module.exports = {
  name: "petpet",
  description: "Caricias",
  category: "Diversion",
  cooldown: 5,
  aliases: [],
  args: true,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  usage: "<usuario | emoji | enlace | archivo>",
  execute: async (client, message, args, prefix) => {

    let emoji = message.guild.emojis.cache.find(x => x.name === args[0].split(":")[1])
    let user = message.mentions.users.first() || client.users.cache.get(args[0])
    let fps = args[1]
    let imagen

    if (emoji) {

      imagen = emoji.url
    } else if (user) {

      imagen = user.displayAvatarURL({ format: "png" })
    } else if (/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(`${args[0]}`)) {

      let a = parse(`${args[0]}`);
      imagen = a[0].url;
    } else if (message.attachments.size > 0) {
      
      imagen = message.attachments.map(x => x.url)[0]
    } else if (args[0]) {
      
      let verifica = await iuv(args[0])
      if(verifica) {

        imagen = args[0]
      } else {

      imagen = message.author.displayAvatarURL({ format: "png" })
      }
    } else {

      imagen = message.author.displayAvatarURL({ format: "png" })
      }

    if (!fps || isNaN(fps) || parseInt(fps) > 10 || parseInt(fps) < 60) {

      fps = 30
    }

    let petpet = await pet(imagen, {
      resolution: 128,
      delay: parseInt(fps),
      background: "transparent"
    });
    let gif = new Discord.MessageAttachment(petpet, "petpet.gif");
    message.channel.send(gif);

  }
}