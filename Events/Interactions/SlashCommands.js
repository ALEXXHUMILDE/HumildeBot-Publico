const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const embedCommand = new EmbedBuilder()
      .setTitle("<a:_:1082895947106889820> Error")
      .setDescription("Este comando no está **actualizado**.")
      .setColor("#ff0000");

    const command = client.commands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({
        embeds: [embedCommand],
        ephemeral: true,
      });
    }

    const embedOwner = new EmbedBuilder()
      .setTitle("<a:_:1082895947106889820> Error")
      .setDescription("Este comando solo lo puede usar el **Developer**.\nDeveloper: <@829868469326970900>")
      .setColor("#ff0000");

    if (command.developer && interaction.user.id !== "829868469326970900") {
      return interaction.reply({
        embeds: [embedOwner],
        ephemeral: true,
      });
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error("Error al ejecutar el comando:", error);
      interaction.reply({
        content: "Hubo un error al intentar ejecutar este comando. Por favor, inténtalo de nuevo más tarde.",
        ephemeral: true,
      });
    }
  },
};
