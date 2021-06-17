const Discord = require("discord.js");
const weky = require("weky")
const pelea = new Map()

module.exports = {
  name: "putazos",
  description: "Putazos!!!",
  cooldown: 5,
  aliases: ["pelea", "fight"],
  args: true,
  devOnly: false,
  guildOnly: false,
  permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "SEND_MESSAGES", "ATTACH_FILES"],
  usage: "<usuario>",
  execute: async (client, message, args, prefix) => {

    let mal_ = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setColor("RED")
      .setTimestamp()
    let bien_ = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setTimestamp()

if (pelea.has(message.guild.id)) {
  mal_.setDescription("😆 Ya hay una pelea en curso en el servidor, espera a que acabe")
  return message.channel.send(mal_)
}

    let author = message.author;
    let enemy = message.mentions.users.first()

    if (!enemy) {
      mal_.setDescription("😆 Menciona a alguien para empezar la pelea")
      return message.channel.send(mal_)
    }
    if (enemy.id === author.id) {
      mal_.setDescription("😆 Imaginate pelear contra ti mismo")
      return message.channel.send(mal_)
    }
    if (enemy.bot) {
      mal_.setDescription("😆 Perderas tu tiempo, los bots siempre ganan")
      return message.channel.send(mal_)
    }

    enemy.health = author.health = 100;
    enemy.armor = author.armor = 0;
    let turn = author;
    let oppturn = enemy;

    if (Math.random() >= 0.50) {
      oppturn = [turn, turn = oppturn][0];
      pelea.set(message.guild.id)
    }

    const performTurn = async (attacker, opponent, retry) => {
      bien_.setDescription(`Es tu turno, elige alguna de estas opciones: \`golpe\`, \`defensa\` o \`terminar\``)
      bien_.setAuthor(turn.tag, turn.displayAvatarURL({ dynamic: true }))
      message.channel.send(bien_);

      let prompt = await message.channel.awaitMessages(m => m.author.id == attacker.id && m.channel.id == message.channel.id, { max: 1, time: 30e3 });

      if (!prompt.first()) {
        pelea.delete(message.guild.id)
        bien_.setDescription(`\`${attacker.tag}\` se te agoto el tiempo para responder, tremendo noob. \`${opponent.tag}\` has ganado`)
        bien_.setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
        message.channel.send(bien_);

      } else if (prompt.first().content.toLowerCase() === 'golpe') {
        let critChance = Math.random() >= 0.75;
        let damage = weky.randomizeNumber(1, (critChance ? 85 : 65));

        opponent.health -= (damage - opponent.armor) < 0 ? 5 : (damage - opponent.armor);
        return damage;

      } else if (prompt.first().content.toLowerCase() === 'defensa') {
        let critChance = Math.random() >= 0.75;
        let defense = weky.randomizeNumber(5, (critChance ? 40 : 20));

        if (attacker.armor < 50) {
          attacker.armor += defense;
          bien_.setDescription(`\`${attacker.tag}\` ha incrementado su defensa a nivel \`${defense}\`. Esta protegido`)
          bien_.setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
          message.channel.send(bien_);

        } else {
          bien_.setDescription(`La armadura ya esta al maximo nivel`)
          bien_.setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
          message.channel.send(bien_);
        }
        return false;

      } else if (prompt.first().content.toLowerCase() === 'terminar') {
        pelea.delete(message.guild.id)
        bien_.setDescription(`\`${attacker.tag}\` ha terminado la pelea, supongo que lo veia venir`)
        bien_.setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
        message.channel.send(bien_);

      } else {
        bien_.setDescription(`${attacker.tag} esa no es una opcion de las que te mostre, vuelve a elegir: \`golpe\`, \`defensa\` o \`terminar\``)
        bien_.setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
        //message.channel.send(bien_);

        if (!retry) {
          return performTurn(attacker, opponent, true);
        }
      }
    };

    const play = async () => {
      const damage = await performTurn(turn, oppturn);
      if (damage === undefined) {
        return;
      }
      if (!damage) {
        oppturn = [turn, turn = oppturn][0];
        return play();
      }
      const adjective_array = ['como loco', 'rapidamente', 'de manera muy eficaz', 'muy divertido', 'muy asombroso', 'peligrosamente']
      const adjective = adjective_array[Math.floor(Math.random() * adjective_array.length)]

      bien_.setDescription(`\`${turn.username}\` ataca ${adjective} a \`${oppturn.tag}\`, provocando \`${damage}\` de daño!\n\`${oppturn.tag}\` le quedan \`${oppturn.health < 0 ? 0 : oppturn.health}\` de salud!`)
      bien_.setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
      message.channel.send(bien_);

      if (turn.health > 0 && oppturn.health > 0) {
        oppturn = [turn, turn = oppturn][0];
        return play();

      } else {
        const loser = turn.health > 1 ? oppturn : turn;
        const winner = loser === turn ? oppturn : turn;
        loser.health = 0;

        const wowword_array = ['Holy heck!', 'Wow!', 'I did not expect that!', 'Like it or hate it,', 'YES!', 'This is so sad!', 'very good', 'Dang!']
        const wowword = wowword_array[Math.floor(Math.random() * wowword_array.length)]
        const noun_array = ['totalmente', '100%', 'absolutamente', 'legitimamente', 'completamente']
        const noun = noun_array[Math.floor(Math.random() * noun_array.length)]
        const verb_array = ['derroto a', 'hizo pedazos a']
        const verb = verb_array[Math.floor(Math.random() * verb_array.length)]

pelea.delete(message.guild.id)
        bien_.setDescription(`\`${winner.tag}\` ${noun} ${verb} \`${loser.tag}\`, ganando con \`${winner.health}\` de salud`)
        bien_.setColor("GREEN")
        bien_.setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
        message.channel.send(bien_);
      }
    };
    play();
  }
}