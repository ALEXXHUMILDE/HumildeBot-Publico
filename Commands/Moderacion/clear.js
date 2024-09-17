const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Borra un número especificado de mensajes.')
        .addIntegerOption(option =>
            option.setName('cantidad')
                .setDescription('Cantidad de mensajes a borrar.')
                .setRequired(true)),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            const embed = new EmbedBuilder()
                .setColor("#FF0000")
                .setTitle("Error")
                .setDescription("<a:_:1082895947106889820> | No tienes suficientes permisos para ejecutar este comando.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const cantidad = interaction.options.getInteger('cantidad');

        if (cantidad < 1 || cantidad > 99) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('<a:_:1082895947106889820> | ¡Solo se puede borrar de 1 a 99 mensajes!');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const messages = await interaction.channel.bulkDelete(cantidad, true);

        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setDescription(`<a:_:1082896003448963172> | Se han borrado ${messages.size} mensajes del canal.`);

        if (messages.size < cantidad) {
            embed.setDescription('<a:_:1082895947106889820> | Lo siento, no puedo borrar mensajes más antiguos de 14 días.');
            embed.setColor("#FF0000");
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};