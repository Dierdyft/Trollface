const Discord = require("discord.js");
const { createCanvas, loadImage } = require('canvas')

module.exports = {
  name: "xd",
  description: "XD",
  category: "Diversion",
  cooldown: 5,
  aliases: [],
  args: false,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES"],
  usage: "<texto>",
  execute: async (client, message, args, prefix) => {

    let txt = args.join(" ")

    let XD = "```\n" + "XD        XD XD XD\n" + 
                       " XD      XD  XD   XD\n" +
                       "  XD    XD   XD    XD\n" +
                       "   XD  XD    XD     XD\n" +
                       "     XD      XD     XD\n" +
                       "   XD  XD    XD     XD\n" +
                       "  XD    XD   XD    XD\n" +
                       " XD      XD  XD   XD\n" +
                       "XD        XD XD XD" + 
             "\n```"
    
    if(txt) {
      if(txt.length > 10) txt = "NO +10"
      XD = XD.replace(/XD/g, txt)
    }

    message.channel.send(XD)
  }
}