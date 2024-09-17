const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anuncio')
        .setDescription('Envia un anuncio.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal donde se enviara el anuncio.')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('El rol que quieres @ (pingear).')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('titulo')
                .setDescription('Titulo del embed.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mensaje')
                .setDescription('Mensaje del anuncio.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Color del embed (sin necesidad de incluir #).')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('imagen')
                .setDescription('Imagen del embed (URL válida).')
                .setRequired(false)
        ),
    async execute(interaction) {
        const { options } = interaction;

        const canal = options.getChannel('canal');
        const rol = options.getRole('rol');
        const titulo = options.getString('titulo');
        const mensaje = options.getString('mensaje');
        let color = options.getString('color');
        const imagen = options.getString('imagen');

        let isValidColor = true;
        let isValidImage = true;
        let errorMessage = '';


        if (!color) {
            color = 'a39676';
        }

        if (color.startsWith('#')) {
            color = color.slice(1);
        }

        if (!/^([0-9A-F]{3}){1,2}$/i.test(color)) {
            isValidColor = false;
            errorMessage += '❌ | El color proporcionado no es un formato HEX válido.\n';
        }

        if (imagen && !/^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/i.test(imagen)) {
            isValidImage = false;
            errorMessage += '❌ | La URL de la imagen no es válida.\n';
        }

        const embed = new EmbedBuilder()
            .setTitle(`${titulo}`)
            .setDescription(`${mensaje}`);

        if (isValidColor) {
            embed.setColor(`#${color}`);
        } else {
            embed.setColor('#a39676');
        }

        if (isValidImage) {
            embed.setImage(imagen);
        }

        await canal.send({ embeds: [embed], content: `${rol}` });

        await interaction.reply({
            content: `Anuncio enviado al canal: **${canal}**`,
            ephemeral: true
        });

        if (errorMessage) {
            await interaction.followUp({
                content: errorMessage,
                ephemeral: true
            });
        }
    }
};
