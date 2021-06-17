const Discord = require("discord.js");
const { createCanvas, loadImage } = require('canvas')
const iuv = require("image-url-validator").default
const sizeOf = require("image-size")
const fetch = require("node-fetch")
const fs = require('fs').promises

module.exports = {
  name: "globo",
  description: "Globo de texto",
  category: "Diversion",
  cooldown: 5,
  aliases: [],
  args: false,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "<enlace | archivo>",
  execute: async (client, message, args, prefix) => {

let user = message.mentions.users.first() || client.users.cache.get(args[0])
    let imagen

    if (message.attachments.size > 0) {

      imagen = message.attachments.map(x => x.url)[0]
    } else if (user) {

      imagen = user.displayAvatarURL({format: "jpg"})
    } else if (args[0]) {

      imagen = args[0]
      let comprobar = await iuv(imagen)
      if (!comprobar) {
        imagen = message.author.displayAvatarURL({format: "jpg"})
      }
    } else {

      imagen = message.author.displayAvatarURL({format: "jpg"})
    }

    async function download(uri, filename) {
      const response = await fetch(uri);
      const buffer = await response.buffer();
      await fs.writeFile(filename, buffer, () =>
        console.log('finished downloading!'));
    }

    await download(imagen, "./globo.png");

    const dimensions = sizeOf('./globo.png');
    const canvas = createCanvas(dimensions.width, dimensions.height + 100);
    const context = canvas.getContext('2d');
    const background = await loadImage(imagen);
    const globo = await loadImage("https://cdn.discordapp.com/attachments/811999869115039794/839578032863576074/globo.png");
    context.drawImage(background, 0, 100, canvas.width, canvas.height - 100);
    context.drawImage(globo, 0, 0, canvas.width, 100);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'globo.png');

    message.channel.send(attachment);
  }
}