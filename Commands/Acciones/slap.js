const anime = require("anime-actions");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slap")
        .setDescription("Cachetear/Bofetear.")
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("Usuario que quieres cachetear/bofetear.")
                .setRequired(true)
        ),

    async execute(interaction) {

        const miembro = interaction.options.getUser("usuario") || interaction.user;

        const animeimagen = await anime.slap();

        const embed = new EmbedBuilder()
            .setDescription(`**${interaction.user.username}** ha cacheteado/bofeteado a **${miembro.username}**.`)
            .setColor("Random")
            .setImage(animeimagen);

        interaction.reply({ embeds: [embed] });
    }
}
