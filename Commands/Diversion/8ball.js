const { SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js");
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Te responderé a tus preguntas.")
    .addStringOption(option => option
      .setName("pregunta")
      .setDescription("Describe tu pregunta.")
      .setRequired(true)),

  async execute(interaction, client) {
    const pregunta = interaction.options.getString("pregunta");

    let respuestas = ["Sí.", "No.", "No lo sé.", "Quizás.", "Puede que sí.", "Puede que no.", "Claramente sí.", "Claramente no."];

    const respuesta = Math.floor(Math.random() * respuestas.length);

    const embed = new EmbedBuilder()
      .setTitle(`Bola mágica de ${client.user.username}`)
      .setColor(config.color)
      .setThumbnail("https://imgs.search.brave.com/_uZzewCNYc2H3zCNkYeAD3HMGjWYntvHVCV3kU8du7E/rs:fit:958:958:1/g:ce/aHR0cDovL3Jlcy5w/dWJsaWNkb21haW5m/aWxlcy5jb20vcGRm/X3ZpZXcvNzEvMTM5/MzA5ODQyMTI2Mzgu/cG5n")
      .addFields(
        { name: `Pregunta de ${interaction.user.username}`, value: `${pregunta}` },
        { name: `Mi respuesta es:`, value: `${respuestas[respuesta]}` }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
