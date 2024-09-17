const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Envía un meme aleatorio de Reddit."),

    async execute(interaction) {
        const { options } = interaction;

        const platform = options.getString("platform");

        const embed = new EmbedBuilder();

        async function obtenerMeme() {
            try {
                const response = await fetch('https://www.reddit.com/r/SpanishMeme/random/.json');
                const meme = await response.json();
                const url = meme[0].data.children[0].data.url;

                await interaction.reply({ embeds: [embed.setImage(url).setURL(url).setColor("Random")] });
            } catch (error) {
                console.error("Error al obtener el meme:", error);
                await interaction.reply("No se pudo obtener el meme. Inténtalo de nuevo más tarde.");
            }
        }

        if (!platform) {
            obtenerMeme();
        }
    }
};
