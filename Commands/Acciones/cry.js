const anime = require("anime-actions");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cry")
        .setDescription("Llorar."),

    async execute(interaction) {

        const animeimagen = await anime.cry();

        const embed = new EmbedBuilder()
            .setDescription(`**${interaction.user.username}** está llorando.`)
            .setColor("Random")
            .setImage(animeimagen);

        interaction.reply({ embeds: [embed] });
    }
}
