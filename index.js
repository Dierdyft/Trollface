const http = require("http");
const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Hola Mundo.")
})
app.listen(3000)

const Levels = require("discord-xp");
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const disbut = require('discord-buttons')(client);

const mongoose = require("mongoose");
const schema = require("./database/models/schema.js");
const niveles = require("./database/models/level.js");
const mensajesDB = require("./database/models/messages.js")
const levels = require("./database/models/levels.js")
client.commands = new Discord.Collection()

const commandFolders = fs.readdirSync("./commands");
for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter(file => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

const eventFiles = fs.readdirSync('./eventos').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./eventos/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

Levels.setURL(process.env.urlMongo);

//Evento message
client.on("message", async msg => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return

  let AddMessage = await mensajesDB.findOne({ usuario: msg.author.id, servidor: msg.guild.id });
  if (!AddMessage) AddMessage = await mensajesDB.create({ usuario: msg.author.id, servidor: msg.guild.id })

  await AddMessage.updateOne({
    $inc: { mensajes: 1 }
  })

  let data_LVL = await niveles.findOne({ Guild: msg.guild.id });
  if (!data_LVL) data_LVL = await niveles.create({ Guild: msg.guild.id });

  let apagador = data_LVL.toggle;
  let canal_nivel = data_LVL.channel
   if (!msg.guild.channels.cache.get(data_LVL.channel)) {
      canal_nivel = msg.channel.id
    } if (!canal_nivel) {
    canal_nivel = msg.channel.id
    }

  if (!data_LVL.ignore_channel.includes(msg.channel.id)) {
    if (!msg.member.roles.cache.some(x => data_LVL.ignore_roles.includes(x.id))) {
      if (apagador) {
        const randomXp = Math.floor(Math.random() * (data_LVL.exp_max - data_LVL.exp_min + 1) + data_LVL.exp_min);
        const hasLeveledUp = await Levels.appendXp(msg.author.id, msg.guild.id, randomXp);

        if (hasLeveledUp) {
          const user = await Levels.fetch(msg.author.id, msg.guild.id);
          let roll = data_LVL.roles.find(e => e.lvl == parseInt(user.level));

          if (roll) {
            if(!msg.guild.roles.cache.get(roll.rol)) {
            client.channels.cache.get(canal_nivel).send(data_LVL.message
              .replace(/{user.mention}/g, msg.author.toString())
              .replace(/{user.name}/g, msg.author.username)
              .replace(/{user.tag}/g, msg.author.tag)
              .replace(/{level}/g, user.level)
              .replace(/{xp}/g, user.xp)
              ); 

            } else {
            msg.member.roles.add(roll.rol);
              client.channels.cache.get(canal_nivel).send(data_LVL.role_message
                  .replace(/{user.mention}/g, msg.author.toString())
                  .replace(/{user.name}/g, msg.author.username)
                  .replace(/{user.tag}/g, msg.author.tag)
                  .replace(/{role}/g, msg.guild.roles.resolve(roll.rol).name)
                  .replace(/{level}/g, user.level)
                  .replace(/{xp}/g, user.xp)
                )
            }

          } else {
            client.channels.cache.get(canal_nivel).send(data_LVL.message
              .replace(/{user.mention}/g, msg.author.toString())
              .replace(/{user.name}/g, msg.author.username)
              .replace(/{user.tag}/g, msg.author.tag)
              .replace(/{level}/g, user.level)
              .replace(/{xp}/g, user.xp)
              );
              
          }
        }
      }
    }
  }
})

//------------------------------------------//

client.bal = (Guild, id) =>
  new Promise(async ful => {
    const data = await schema.findOne({ Guild, id });
    if (!data) return ful(0);
    ful(data.coins);
  });

client.add = (Guild, id, coins) => {
  schema.findOne({ Guild, id }, async (err, data) => {
    if (err) throw err;
    if (data) {
      data.coins += coins;
    } else {
      data = new schema({ Guild, id, coins });
    }
    data.save();
  });
};

client.rmv = (Guild, id, coins) => {
  schema.findOne({ Guild, id }, async (err, data) => {
    if (err) throw err;
    if (data) {
      data.coins -= coins;
    } else {
      data = new schema({ Guild, id, coins: -coins });
    }
    data.save();
  });
};

client.balb = (Guild, id) =>
  new Promise(async ful => {
    const data = await schema.findOne({ Guild, id });
    if (!data) return ful(0);
    ful(data.bank);
  });

client.addb = (Guild, id, bank) => {
  schema.findOne({ Guild, id }, async (err, data) => {
    if (err) throw err;
    if (data) {
      data.bank += bank;
    } else {
      data = new schema({ Guild, id, bank });
    }
    data.save();
  });
};

client.rmvb = (Guild, id, bank) => {
  schema.findOne({ Guild, id }, async (err, data) => {
    if (err) throw err;
    if (data) {
      data.bank -= bank;
    } else {
      data = new schema({ Guild, id, bank: -bank });
    }
    data.save();
  });
};
//------------------------------------------//

client.login(process.env.token);