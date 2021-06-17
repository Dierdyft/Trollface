const Discord = require("discord.js")

module.exports = {
  name: "decir",
  description: "Decir",
  category: "Diversion",
  cooldown: 10,
  aliases: ["wh"],
  args: true,
  devOnly: false,
  guildOnly: true,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "MANAGE_WEBHOOKS"],
  usage: "<usuarioID> <mensaje>",
  execute: async (client, message, args, prefix) => {

    let user
    let nick

    client.users.fetch(args[0]).then(async sus => {

      if (message.guild.members.cache.has(sus.id)) {
        user = sus.displayAvatarURL()
        nick = message.guild.members.cache.get(sus.id).displayName

      } else {
        user = sus.displayAvatarURL()
        nick = sus.username

      }

      if (!args.slice(1).join(" ")) return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
          .setDescription("😆 Proporciona el mensaje a simular")
          .setColor("RED")
          .setTimestamp()
      )

      let webhook = await message.channel.fetchWebhooks()
      webhook = webhook.find(x => x.name === "Trollge")

      if (!webhook) {
        webhook = await message.channel.createWebhook("Trollge", {
          avatar: user
        })
      }

      await webhook.edit({
        avatar: user,
        name: nick
      })

      message.delete()

      webhook.send(args.slice(1).join(" "))

      await webhook.edit({
        avatar: client.user.displayAvatarURL(),
        name: "Trollge"
      })

    }).catch(err => {

      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
          .setDescription("😆 La ID proporcionada no existe")
          .setColor("RED")
          .setTimestamp()
      )
    })

  }
}