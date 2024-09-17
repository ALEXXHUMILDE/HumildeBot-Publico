const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Dar timeout a un usuario.")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Usuario a dar timeout.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("tiempo")
        .setDescription("Tiempo del timeout en minutos.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("razon").setDescription("Razón del timeout.")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const user = interaction.options.getUser("usuario");
    const tiempo = interaction.options.getInteger("tiempo");
    const { guild } = interaction;

    let razon = interaction.options.getString("razon");
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);

    if (!razon) razon = "No hay razón.";
    if (user.id === interaction.user.id)
      return interaction.reply({
        content: "<a:_:1082895947106889820> | ¡No puedes darte timeout a ti mismo!",
        ephemeral: true,
      });
    if (user.id === client.user.id)
      return interaction.reply({
        content: "<a:_:1082895947106889820> | ¡No puedes darme timeout a mí!",
        ephemeral: true,
      });
    if (member.roles.highest.position >= interaction.member.roles.highest.position)
      return interaction.reply({
        content: "<a:_:1082895947106889820> | ¡No puedes dar timeout a alguien con un rol igual o superior al tuyo!",
        ephemeral: true,
      });
    if (!member.kickable)
      return interaction.reply({
        content: "<a:_:1082895947106889820> | ¡No puedo dar timeout a alguien con un rol superior al mío!",
        ephemeral: true,
      });
    if (tiempo > 10000)
      return interaction.reply({
        content: "<a:_:1082895947106889820> | ¡El tiempo no puede superar los 10,000 minutos!",
        ephemeral: true,
      });

    const embed = new EmbedBuilder()
      .setTitle("<a:_:1082896003448963172> Usuario aislado")
      .setDescription(`**${user.tag}** fue aislado exitosamente del servidor!\n\n**Razón:**\n${razon}`)
      .setColor(config.color)
      .setTimestamp()
      .setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`);

    await member.timeout(tiempo * 60 * 1000, razon).catch(console.error);

    interaction.reply({ embeds: [embed] });
  },
};
