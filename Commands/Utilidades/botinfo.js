const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Te mostraré mi información."),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const user = interaction.user;
    await user.fetch({ force: true });

    const isMongoDBConnected = mongoose.connection.readyState === 1;

    const uptime = client.uptime;
    const segundos = Math.floor(uptime / 1000) % 60;
    const minutos = Math.floor(uptime / (1000 * 60)) % 60;
    const horas = Math.floor(uptime / (1000 * 60 * 60)) % 24;
    const dias = Math.floor(uptime / (1000 * 60 * 60 * 24));

    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setAuthor({
        name: `${client.user.tag}`,
        iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
      })
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`Información de ${client.user.username}`)
      .addFields(
        { name: "📆 **Creado:**", value: `<t:${parseInt(client.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "🔰 **ID:**", value: `${client.user.id}`, inline: true },
        { name: "👑 **Creador:**", value: `<@829868469326970900> (𝐀𝐋𝐄𝐗𝐗#0001)`, inline: true },
        { name: "⚙️ **Comandos:**", value: `${client.commands.size}`, inline: true },
        { name: "💾 **Servidores:**", value: `${client.guilds.cache.size}`, inline: true },
        { name: "👥 **Usuarios:**", value: `${client.users.cache.size}`, inline: true },
        { name: "🏓 **Ping:**", value: `${client.ws.ping}ms`, inline: true },
        { name: "⌛ **Tiempo conectado:**", value: `${dias} días, ${horas} horas, ${minutos} minutos, ${segundos} segundos`, inline: true },
        { name: "🔌 **Conexión a MongoDB:**", value: isMongoDBConnected ? "Conectado" : "Desconectado", inline: true }
      );

    interaction.reply({ embeds: [embed] });
  },
};
