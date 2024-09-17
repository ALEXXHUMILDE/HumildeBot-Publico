const anime = require("anime-actions");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cuddle")
        .setDescription("Abrazar.")
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("Usuario que quieres abrazar.")
                .setRequired(true)
        ),

    async execute(interaction) {

        const miembro = interaction.options.getUser("usuario") || interaction.user;

        const animeimagen = await anime.cuddle();

        const embed = new EmbedBuilder()
            .setDescription(`**${interaction.user.username}** ha abrazado a **${miembro.username}**.`)
            .setColor("Random")
            .setImage(animeimagen);

        interaction.reply({ embeds: [embed] });
    }
}
