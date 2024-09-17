const anime = require("anime-actions");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("happy")
        .setDescription("Feliz"),

    async execute(interaction) {

        const animeimagen = await anime.happy();

        const embed = new EmbedBuilder()
            .setDescription(`**${interaction.user.username}** está feliz.`)
            .setColor("Random")
            .setImage(animeimagen);

        interaction.reply({ embeds: [embed] });
    }
}
