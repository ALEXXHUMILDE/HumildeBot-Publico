const anime = require("anime-actions");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kiss")
        .setDescription("Besar.")
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("Usuario que quieres besar.")
                .setRequired(true)
        ),

    async execute(interaction) {

        const miembro = interaction.options.getUser("usuario") || interaction.user;

        const animeimagen = await anime.kiss();

        const embed = new EmbedBuilder()
            .setDescription(`**${interaction.user.username}** ha besado a **${miembro.username}**.`)
            .setColor("Random")
            .setImage(animeimagen);

        interaction.reply({ embeds: [embed] });
    }
}
