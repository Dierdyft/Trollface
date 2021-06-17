const Discord = require("discord.js");
const { parse } = require("twemoji-parser");
const svg2img = require("node-svg2img");

module.exports = {
  name: "jumbo",
  description: "Expande o modifica el tamaño de los emojis predeterminados de discord",
  category: "Diversion",
  cooldown: 5,
  aliases: [],
  args: true,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "<emoji> <tamaño>",
  execute: async (client, message, args, prefix) => {

    try {
      const emoji = args[0];

      const number = parseInt(args.slice(1).join(" "));
      const size = number && (number <= 1024 && number > 0) ? number : 150;

      const regexp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(
        `${emoji}`
      );

      const err = new Discord.MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(
          "😆 El emoji proporcionado debe ser predeterminado de Discord"
        )
        .setColor("RED")
        .setTimestamp();
      if (!regexp) return message.channel.send(err);

      const a = parse(`${emoji}`);
      const b = a[0].url;
      svg2img(b, { format: "png", width: size, height: size }, function(
        err,
        data
      ) {
        const ab = new Discord.MessageAttachment(data, "Jumbo.png");
        message.channel.send(ab);
      });
    } catch (e) {
      const error = new Discord.MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(
          "😆 Ha ocurrido un error: " + e.message
        )
        .setColor("RED")
        .setTimestamp();
      return message.channel.send(error);
    }
  }
};
