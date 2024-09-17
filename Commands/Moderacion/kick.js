const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulsar a un usuario.")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Usuario a expulsar.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("razon").setDescription("Razón de la expulsión.")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const user = interaction.options.getUser("usuario");
    const { guild } = interaction;

    let razon = interaction.options.getString("razon");
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);

    if (!razon) razon = "No hay razón.";
    if (user.id === interaction.user.id)
      return interaction.reply({
        content: `<a:_:1082895947106889820> | ¡No puedes expulsarte a ti mismo!`,
        ephemeral: true,
      });
    if (user.id === client.user.id)
      return interaction.reply({
        content: `<a:_:1082895947106889820> | ¡No puedes expulsarme a mí!`,
        ephemeral: true,
      });
    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        content: `<a:_:1082895947106889820> | ¡No puedes expulsar a alguien con un rol igual o superior al tuyo!`,
        ephemeral: true,
      });
    if (!member.kickable)
      return interaction.reply({
        content: `<a:_:1082895947106889820> | ¡No puedo expulsar a alguien con un rol superior al mío!`,
        ephemeral: true,
      });

    const embed = new EmbedBuilder()
      .setTitle(`<a:_:1082896003448963172> Usuario expulsado`)
      .setDescription(`**${user.tag}** fue expulsado exitosamente del servidor.\n\n**Razón:**\n${razon}`)
      .setColor(config.color)
      .setTimestamp()
      .setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`);

    await member.kick(razon).catch(console.error);

    interaction.reply({ embeds: [embed] });
  },
};
