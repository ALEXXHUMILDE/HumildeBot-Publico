const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Panel de ayuda.'),

  async execute(interaction) {
    const { guild } = interaction;
    const user = interaction.user;

    const commandFolders = fs.readdirSync(path.resolve(__dirname, '../../Commands'));
    const commandCategories = [];

    for (const folder of commandFolders) {
      const commands = fs.readdirSync(path.join(__dirname, `../../Commands/${folder}`)).filter(file => file.endsWith('.js'));
      const commandsInfo = [];

      for (const file of commands) {
        const command = require(`../../Commands/${folder}/${file}`);
        if (command.data) {
          commandsInfo.push({
            name: command.data.name,
            description: command.data.description || 'No hay descripción.'
          });
        }
      }

      commandCategories.push({
        label: folder.charAt(0).toUpperCase() + folder.slice(1),
        description: `Comandos de ${folder}.`,
        value: folder,
        emoji: '📁',
        commands: commandsInfo
      });
    }

    const menuOptions = commandCategories.map(category => ({
      label: category.label,
      description: category.description,
      value: category.value,
      emoji: '📁'
    }));

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('help_menu')
      .setPlaceholder('Selecciona una categoría')
      .addOptions(menuOptions);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const mainEmbed = new EmbedBuilder()
      .setTitle('Panel de Ayuda')
      .setColor(config.color)
      .setDescription(`Humilde es un Bot que tiene comandos de utilidad, diversión y moderación.\n\n**Web**: [humildebot.pages.dev](https://humildebot.paes.dev)\n**Invitarlo**: [Click aquí!](https://dsc.gg/humilde-bot)`);

    let replyMessage = await interaction.reply({
      embeds: [mainEmbed],
      components: [row]
    });

    const filter = i => i.customId === 'help_menu' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      const selectedCategory = commandCategories.find(cat => cat.value === i.values[0]);

      if (selectedCategory) {
        const commandsDescription = selectedCategory.commands.map(cmd => `${cmd.name} - ${cmd.description}`).join('\n');

        const categoryEmbed = new EmbedBuilder()
          .setTitle(`Comandos de ${selectedCategory.label}`)
          .setDescription(commandsDescription || 'No hay comandos disponibles en esta categoría.')
          .setColor(config.color)
          .setThumbnail(`${guild.iconURL({ dynamic: true })}`)
          .setFooter({ text: `Pedido por ${user.username}`, iconURL: `${user.displayAvatarURL({ dynamic: true })}` })
          .setTimestamp();

        await i.update({ embeds: [categoryEmbed], components: [row] });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({ components: [] });
      }
    });
  }
};