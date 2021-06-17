const Discord = require('discord.js');
const fetch = require('node-fetch');
const iuv = require('image-url-validator').default;

module.exports = {
	name: 'reddit',
	description: 'Busca subreddits',
	category: 'Diversion',
	cooldown: 5,
	aliases: [],
	args: true,
	devOnly: false,
	guildOnly: false,
	permissions: [
		'EMBED_LINKS',
		'USE_EXTERNAL_EMOJIS',
		'SEND_MESSAGES',
		'ATTACH_FILES'
	],
	usage: '<subreddit>',
	execute: async (client, message, args, prefix) => {
		const mal_ = new Discord.MessageEmbed()
			.setAuthor(
				message.author.tag,
				message.author.displayAvatarURL({ dynamic: true })
			)
			.setColor('RED')
			.setTimestamp();

		function format(post) {
			return {
				id: typeof post.id !== 'undefined' ? post.id : null,
				title: typeof post.title !== 'undefined' ? post.title : null,
				author: typeof post.author !== 'undefined' ? post.author : null,
				postLink:
					typeof post.id !== 'undefined' ? 'https://redd.it/' + post.id : null,
				image: typeof post.url !== 'undefined' ? post.url : null,
				text: typeof post.selftext !== 'undefined' ? post.selftext : null,
				thumbnail:
					typeof post.thumbnail !== 'undefined' ? post.thumbnail : null,
				subreddit:
					typeof post.subreddit !== 'undefined' ? post.subreddit : null,
				NSFW: typeof post.over_18 !== 'undefined' ? post.over_18 : null,
				spoiler: typeof post.spoiler !== 'undefined' ? post.spoiler : null,
				createdUtc:
					typeof post.created_utc !== 'undefined' ? post.created_utc : null,
				upvotes: typeof post.ups !== 'undefined' ? post.ups : null,
				downvotes: typeof post.downs !== 'undefined' ? post.downs : null,
				upvoteRatio:
					typeof post.upvote_ratio !== 'undefined' ? post.upvote_ratio : null
			};
		}

		let api = 'https://api.reddit.com/r';
		let busqueda = ['hot', 'top', 'rising'];

		function FetchSubreddit(subreddit) {
			const link = `${api}/${subreddit}/${
				busqueda[Math.floor(Math.random() * busqueda.length)]
			}`;
			let data;
			return fetch(link)
				.then(res => res.json())
				.then(res => {
					if (!res) {
						mal_.setDescription('🥱 Ha ocurrido un error');
						return message.channel.send(mal_);
					} else if (!res.data) {
						mal_.setDescription('🥱 El subreddit proporcionado es privado');
						return message.channel.send(mal_);
					} else if (res.data.dist === 0) {
						mal_.setDescription('🥱 El subreddit proporcionado no existe');
						return message.channel.send(mal_);
					} else {
						const post =
							res.data.children[
								Math.floor(Math.random() * res.data.children.length)
							];
						data = format(post.data);
					}
					return data;
				});
		}

		let datos = await FetchSubreddit(args.join('_'));

		if (!datos) {
			mal_.setDescription('🥱 El subreddit proporcionado no existe');
			return message.channel.send(mal_);
		}

		if (datos.NSFW) {
			if (!message.channel.nsfw) {
				mal_.setDescription(
					'🥱 El canal debe ser NSFW para mostrar la publicacion'
				);
				return message.channel.send(mal_);
			}
		}

		let user_link = await fetch(
			`https://www.reddit.com/user/${datos.author}/about.json`
		);
		let user_json = await user_link.json();
		let foto = user_json.data;

		if (!foto) {
			foto =
				'https://media.discordapp.net/attachments/851560386787409961/851565626270416907/avatar_default_04_FF4500.png?width=230&height=230';
		} else if (!foto.subbredit) {
			foto =
				'https://media.discordapp.net/attachments/851560386787409961/851565626270416907/avatar_default_04_FF4500.png?width=230&height=230';
		} else {
			foto = user_json.data.subreddit.icon_img.replace(/(amp;)/gi, '');
		}

		let imagen = await iuv(datos.image);
		if (!imagen) {
			imagen = null;
		} else {
			imagen = datos.image;
		}

		const PublicacionEmbed = new Discord.MessageEmbed()
			.setAuthor(datos.author, foto)
			.setTitle('Enlace a la publicacion')
			.setURL(datos.postLink)
			.setDescription(`**${datos.title}**\n${datos.image}`)
			.setImage(imagen)
			.setColor(0xf4511e)
			.setFooter(`👍 ${datos.upvotes
			? datos.upvotes.toLocaleString() : 0} | 👎 ${datos.downvotes
			? datos.downvotes.toLocaleString() : 0 }`)
			.setTimestamp();

		message.channel.send(PublicacionEmbed);
	}
};
