const { Client, ActivityType, EmbedBuilder, WebhookClient } = require("discord.js");
const { loadCommands } = require("../../Handlers/commandHandler");
const config = require("../../config.json");
const { version: djsversion } = require('discord.js');
const restart = new Date().toLocaleString();
const ms = require('ms');

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    const webhookClient = new WebhookClient({ id: '', token: '' });
    const mensaje = new EmbedBuilder()
      .setTitle(`**> Inicio de ${client.user.username}**`)
      .setDescription(`> **| Estado**: Activo\n> **| ${client.user.username}**\n> **| El bot se encendió el:** ${restart}\n> **| Tiempo conectado:** <t:${parseInt(Date.now() / 1000)}:R>\n> **| Versión de Discord.js:** V${djsversion}\n> **| Versión de Node.js:** ${process.version}\n\n***Se inició correctamente***`)
      .setColor(config.color)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

    webhookClient.send({
      username: 'Humilde',
      avatarURL: 'https://cdn.discordapp.com/attachments/986117869597253634/1285250849697828914/fd9f627b51dc29febdf9ed76be728612.png?ex=66e996a1&is=66e84521&hm=1df609c25472af31249160d9a443d1e7d61de8032bce80dc4bcabf234e28a25b&',
      embeds: [mensaje],
    });

    let totalUsers = 0;
    for (const guild of client.guilds.cache.values()) {
      await guild.members.fetch();
      totalUsers += guild.memberCount;
    }

    console.log(`${client.user.tag} se ha conectado correctamente`);

    loadCommands(client);

    const tiempo = 1000 * 5;

    const status = [
      [{
        name: "/help",
        type: ActivityType.Playing
      }],
      [{
        name: `${totalUsers} usuarios y ${client.guilds.cache.size} servidores`,
        type: ActivityType.Watching
      }],
      [{
        name: `¡Mencióname!`,
        type: ActivityType.Playing
      }],
      [{
        name: `humildebot.pages.dev`,
        type: ActivityType.Watching
      }]
    ];

    setInterval(() => {
      const astatus = status[Math.floor(Math.random() * status.length)];
      client.user.setPresence({ activities: astatus, status: "online" });
    }, tiempo);
  },
};
