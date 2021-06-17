const Discord = require("discord.js");
const fetch = require("node-fetch").default

module.exports = {
  name: "80s",
  description: "Usa tu avatar o el de un usuario para pasarla al filtro 80s",
  category: "Diversion",
  cooldown: 5,
  aliases: [],
  args: false,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "<usuario>",
  execute: async (client, message, args, prefix) => {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author

    try {

      const buffer = await (await fetch(`https://api.monkedev.com/canvas/80s?imgUrl=${encodeURIComponent(user.displayAvatarURL({ format: 'png' }))}&key=zD0naYji29YruSF5mPTQ6DbvY`)).buffer();

      let img = new Discord.MessageAttachment(buffer, "LOLOLOL.png")
      message.channel.send(img)
    } catch (e) {

      let error = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription("😆 Ha ocurrido un error: " + e.message)
        .setColor("RED")
        .setTimestamp()

      return message.channel.send(error)
    }
  }
};


