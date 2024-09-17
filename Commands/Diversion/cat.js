const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("michi")
    .setDescription("Obtén una imagen aleatoria de un gato"),

  async execute(interaction) {
    try {
      const response = await fetch("https://api.thecatapi.com/v1/images/search", {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "live_nOMbCVAL4eO3dseoWiiqh568NtFfXjv4azqNOorcqvIXH4rUcBuyyanV8eKoa8dr"
        }
      });
      const data = await response.json();
      const imageUrl = data[0].url;

      const embed = new EmbedBuilder()
        .setTitle("Imagen aleatoria de un gato")
        .setImage(imageUrl)
        .setTimestamp()
        .setColor("Random");

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error al obtener la imagen de gato:", error);
      await interaction.reply("No se pudo obtener la imagen de gato. Error: " + error.message);
    }
  }
};
