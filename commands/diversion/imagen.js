const Discord = require('discord.js');
const cheerio = require('cheerio');
const request = require('request');

module.exports = {
	name: 'imagen',
	description: 'Busca imagenes',
	category: 'Diversion',
	cooldown: 5,
	aliases: ['img', 'image'],
	args: true,
	devOnly: false,
	guildOnly: false,
	permissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS', 'SEND_MESSAGES', 'ATTACH_FILES'],
	usage: '<busqueda>',
	execute: async (client, message, args, prefix) => {
  /*  
    async function main(){
	let petition = await new gse.search()
		.setType("image")
	  .setQuery(args.join(" ")).run()

}

main()

let i = 0
const ImagenEmbed = new Discord.MessageEmbed()
.setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
.setTitle(main()[i].title)
.setDescription(main()[i].from)
.setImage(main()[i].image)

message.channel.send(ImagenEmbed)*/
	}
};
