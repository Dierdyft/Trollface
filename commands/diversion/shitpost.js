const Discord = require('discord.js');
const shitpost = require('../../shitpost.json');

module.exports = {
	name: 'shitpost',
	description: 'Un video shitpost proveniente de shitpost.json',
	category: 'Diversion',
	cooldown: 5,
	aliases: ['sp', 'meme'],
	args: false,
	devOnly: false,
	guildOnly: false,
	permissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
	usage: '',
	execute: async (client, message, args, prefix) => {
		let videos = shitpost.video;
		let video = videos[Math.floor(Math.random() * videos.length)];

		if (video.endsWith('.mp4')) {
			message.channel.send(
				new Discord.MessageAttachment(video, 'shitpost.mp4')
			);
		} else {
			message.channel.send(video);
		}
	}
};
