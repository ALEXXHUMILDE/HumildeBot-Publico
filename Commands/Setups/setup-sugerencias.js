const { SlashCommandBuilder, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const suggestion = require('../../Models/Sugerencias');
const formatResults = require('../../Utilts/formatResults');
const config = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sugerencias')
        .setDescription('Configura el sistema de sugerencias.')
        .addSubcommand(command =>
            command.setName('setup')
                .setDescription('Configura un canal de sugerencias.')
                .addChannelOption(option =>
                    option.setName('canal')
                        .setDescription('Ingresa un canal.')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand(command =>
            command.setName('disable')
                .setDescription('Deshabilita un canal de sugerencias que ya existe.')
        )
        .addSubcommand(command =>
            command.setName('enviar')
                .setDescription('Envía una sugerencia para administradores y personal.')
                .addStringOption(option =>
                    option.setName('sugerencia')
                        .setDescription('Ingresa una sugerencia.')
                        .setRequired(true)
                )
        ),
    async execute(interaction, client) {
        const { options } = interaction;
        const sub = options.getSubcommand();
        const Data = await suggestion.findOne({ GuildID: interaction.guild.id });
        const suggestmsg = options.getString('sugerencia');
        const member = interaction.member;

        switch (sub) {
            case 'setup':
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                    const embed = new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("Error")
                        .setDescription("❌ No tienes permiso para usar este comando.")
                        .setFooter({ text: `${client.user.tag} || ${client.ws.ping}ms`, iconURL: client.user.displayAvatarURL() });
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (Data) {
                    return await interaction.reply({ content: '¡Ya tienes un canal de sugerencias **configurado**!', ephemeral: true });
                } else {
                    const channel = options.getChannel('canal');
                    await suggestion.create({
                        GuildID: interaction.guild.id,
                        ChannelID: channel.id
                    });

                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setAuthor({ name: `Sistema de Sugerencias de ${interaction.guild.name}` })
                        .setTitle('¡Éxito!')
                        .setDescription(`:white_check_mark: El sistema de sugerencias se ha **configurado** correctamente en ${channel}!`);

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                break;

            case 'disable':
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                    const embed = new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("Error")
                        .setDescription("❌ No tienes permiso para usar este comando.")
                        .setFooter({ text: `${client.user.tag} || ${client.ws.ping}ms`, iconURL: client.user.displayAvatarURL() });
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }

                const channel = options.getChannel('canal') || interaction.channel;

                if (!Data) {
                    return await interaction.reply({ content: '¡No tienes un canal de sugerencias **configurado**!', ephemeral: true });
                } else {
                    await suggestion.deleteMany({
                        GuildID: interaction.guild.id,
                        ChannelID: channel.id
                    });

                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setAuthor({ name: `Sistema de Sugerencias de ${interaction.guild.name}` })
                        .setTitle('¡Éxito!')
                        .setDescription(':white_check_mark: El sistema de sugerencias se ha **deshabilitado** correctamente!');

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                break;

            case 'enviar':
                if (!Data) {
                    return await interaction.reply({ content: '¡No tienes un canal de sugerencias **configurado**!', ephemeral: true });
                } else {
                    const channelID = Data.ChannelID;
                    const channel = interaction.guild.channels.cache.get(channelID);

                    if (!channel) {
                        return await interaction.reply({ content: '¡No se pudo encontrar el canal de sugerencias configurado!', ephemeral: true });
                    }

                    await interaction.reply({ content: '¡Tu sugerencia ha sido enviada!', ephemeral: true });

                    const num1 = Math.floor(Math.random() * 256);
                    const num2 = Math.floor(Math.random() * 256);
                    const num3 = Math.floor(Math.random() * 256);
                    const num4 = Math.floor(Math.random() * 256);
                    const num5 = Math.floor(Math.random() * 256);
                    const num6 = Math.floor(Math.random() * 256);
                    const SuggestionID = `${num1}${num2}${num3}${num4}${num5}${num6}`;

                    const suggestionEmbed = new EmbedBuilder()
                        .setAuthor({ name: `Sistema de Sugerencias de ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ size: 256 }) })
                        .setColor(config.color)
                        .setThumbnail(interaction.user.displayAvatarURL({ size: 512 }))
                        .setTitle(`Sugerencia de **${interaction.user.username}**`)
                        .setDescription(`> ${suggestmsg}`)
                        .setTimestamp()
                        .setFooter({ text: `ID de Sugerencia: ${SuggestionID}` })
                        .addFields({ name: 'Votos a favor', value: '**Sin votos**', inline: true })
                        .addFields({ name: 'Votos en contra', value: '**Sin votos**', inline: true })
                        .addFields({ name: 'Votos', value: formatResults() })
                        .addFields({ name: 'Autor', value: `> ${interaction.user}`, inline: false });

                    const button = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('upv')
                                .setEmoji('<:tup:1162598259626352652>')
                                .setLabel('Voto a favor')
                                .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                                .setCustomId('downv')
                                .setEmoji('<:tdown:1162598331390889994>')
                                .setLabel('Voto en contra')
                                .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                                .setCustomId('totalvotes')
                                .setEmoji('💭')
                                .setLabel('Votos')
                                .setStyle(ButtonStyle.Secondary)
                        );

                    const button2 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('appr')
                                .setEmoji('<a:AUSC_checked:1011088709266985110>')
                                .setLabel('Aprobar')
                                .setStyle(ButtonStyle.Success),

                            new ButtonBuilder()
                                .setCustomId('rej')
                                .setEmoji('<a:rejected:1162622460835922043>')
                                .setLabel('Rechazar')
                                .setStyle(ButtonStyle.Danger)
                        );

                    const msg = await channel.send({ content: `Sugerencia de ${interaction.user}`, embeds: [suggestionEmbed], components: [button, button2] });
                    msg.createMessageComponentCollector();

                    await suggestion.create({
                        Msg: msg.id,
                        GuildID: interaction.guild.id,
                        AuthorID: interaction.user.id,
                        ChannelID: channel.id,
                        upvotes: 0,
                        downvotes: 0,
                        Upmembers: [],
                        Downmembers: []
                    });
                }
        }
    }
};
