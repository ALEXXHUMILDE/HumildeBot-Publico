const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
    Events
} = require("discord.js");

const mongoose = require("mongoose");
const colors = require("colors");
const config = require("./config.json");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const client = new Client({
    intents: 3276799,
    partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./Handlers/eventHandler");


const database = require("./Database/mongoose");
database();

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.utilts = new Collection();

loadEvents(client);

require(`./Handlers/anti-crash`)(client);

client.login(client.config.token);


const suggestion = require('./Models/Sugerencias');
const formatResults = require('./Utilts/formatResults');

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.guild || !interaction.message || !interaction.isButton()) return;

    const data = await suggestion.findOne({ GuildID: interaction.guild.id, Msg: interaction.message.id });
    if (!data) return;

    const message = await interaction.channel.messages.fetch(data.Msg);

    if (interaction.customId === 'upv') {
        if (data.Upmembers.includes(interaction.user.id)) {
            return await interaction.reply({ content: `¡No puedes volver a votar! Ya has enviado un voto a favor de esta sugerencia.`, ephemeral: true });
        }

        let Downvotes = data.downvotes;
        if (data.Downmembers.includes(interaction.user.id)) {
            Downvotes -= 1;
            data.downvotes -= 1;
        }

        data.Upmembers.push(interaction.user.id);
        data.Downmembers.pull(interaction.user.id);

        const newEmbed = EmbedBuilder.from(message.embeds[0])
            .setFields(
                { name: `Votos a favor`, value: `> **${data.upvotes + 1}** Votos`, inline: true },
                { name: `Votos negativos`, value: `> **${Downvotes}** Votos`, inline: true },
                { name: `Autor`, value: `> <@${data.AuthorID}>` },
                { name: `Votos`, value: formatResults(data.Upmembers, data.Downmembers) }
            );

        const buttonRow1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('upv')
                    .setLabel('Votos a favor')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('<:tup:1162598259626352652>'),

                new ButtonBuilder()
                    .setCustomId('downv')
                    .setEmoji('<:tdown:1162598331390889994>')
                    .setLabel('Votos negativos')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('totalvotes')
                    .setEmoji('💭')
                    .setLabel('Votos')
                    .setStyle(ButtonStyle.Secondary)
            );

        const buttonRow2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('appr')
                    .setLabel('Aprobado')
                    .setEmoji('<a:AUSC_checked:1011088709266985110>')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('rej')
                    .setEmoji('<a:rejected:1162622460835922043>')
                    .setLabel('Rechazado')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.update({ embeds: [newEmbed], components: [buttonRow1, buttonRow2] });

        data.upvotes += 1;
        await data.save();
    }

    if (interaction.customId === 'downv') {
        if (data.Downmembers.includes(interaction.user.id)) {
            return await interaction.reply({ content: `¡No puedes rechazar dos veces esta sugerencia!`, ephemeral: true });
        }

        let Upvotes = data.upvotes;
        if (data.Upmembers.includes(interaction.user.id)) {
            Upvotes -= 1;
            data.upvotes -= 1;
        }

        data.Downmembers.push(interaction.user.id);
        data.Upmembers.pull(interaction.user.id);

        const newEmbed = EmbedBuilder.from(message.embeds[0])
            .setFields(
                { name: `Votos a favor`, value: `> **${Upvotes}** Votos`, inline: true },
                { name: `Votos negativos`, value: `> **${data.downvotes + 1}** Votos`, inline: true },
                { name: `Autor`, value: `> <@${data.AuthorID}>` },
                { name: `Votos`, value: formatResults(data.Upmembers, data.Downmembers) }
            );

        const buttonRow1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('upv')
                    .setLabel('Votos a favor')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('<:tup:1162598259626352652>'),

                new ButtonBuilder()
                    .setCustomId('downv')
                    .setEmoji('<:tdown:1162598331390889994>')
                    .setLabel('Votos negativos')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('totalvotes')
                    .setEmoji('💭')
                    .setLabel('Votos')
                    .setStyle(ButtonStyle.Secondary)
            );

        const buttonRow2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('appr')
                    .setLabel('Aprobado')
                    .setEmoji('<a:AUSC_checked:1011088709266985110>')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('rej')
                    .setEmoji('<a:rejected:1162622460835922043>')
                    .setLabel('Rechazado')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.update({ embeds: [newEmbed], components: [buttonRow1, buttonRow2] });

        data.downvotes += 1;
        await data.save();
    }

    if (interaction.customId === 'totalvotes') {
        const upvoters = data.Upmembers.map(memberId => `<@${memberId}>`);
        const downvoters = data.Downmembers.map(memberId => `<@${memberId}>`);

        const embed = new EmbedBuilder()
            .addFields(
                { name: `Votos a favor (${upvoters.length})`, value: `> ${upvoters.join(', ').slice(0, 1020) || `Sin Votos Positivos!`}`, inline: true },
                { name: `Votos negativos (${downvoters.length})`, value: `> ${downvoters.join(', ').slice(0, 1020) || `Sin votos Negativos!`}`, inline: true }
            )
            .setColor('Random')
            .setTimestamp()
            .setFooter({ text: `💭 Datos de votación` })
            .setAuthor({ name: `${interaction.guild.name}'s Sistema de sugerencias` });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId === 'appr') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return await interaction.reply({ content: `Sólo los administradores y el personal pueden utilizar este botón.`, ephemeral: true });
        }

        const newEmbed = EmbedBuilder.from(message.embeds[0])
            .setDescription('¡<a:_:1082896003448963172> Tu sugerencia ha sido Aprobada!');

        await interaction.update({ embeds: [newEmbed], components: [message.components[0]] });
    }

    if (interaction.customId === 'rej') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return await interaction.reply({ content: `Sólo los administradores y el personal pueden utilizar este botón.`, ephemeral: true });
        }

        const newEmbed = EmbedBuilder.from(message.embeds[0])
            .setDescription('¡<a:_:1082895947106889820> Tu sugerencia ha sido Rechazada!');

        await interaction.update({ embeds: [newEmbed], components: [message.components[0]] });
    }
});
