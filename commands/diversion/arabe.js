const Discord = require("discord.js");
const shitpost = require("../../shitpost.json");

module.exports = {
  name: "arabe",
  description: "Un meme sin sentido alguno",
  category: "Diversion",
  cooldown: 5,
  aliases: [],
  args: false,
  devOnly: false,
  guildOnly: false,
  permissions: ["SEND_MESSAGES", "ATTACH_FILES"],
  usage: "",
  execute: async (client, message, args, prefix) => {

    let videos = shitpost.arabe;
    let video = videos[Math.floor(Math.random() * videos.length)];

    message.channel.send(new Discord.MessageAttachment(video, "arabe.mp4"));
  }
};
