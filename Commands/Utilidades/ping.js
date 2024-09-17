const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const config = require("../../config.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Te respondere pong y con mi latencia."),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    const embed = new EmbedBuilder()
        .setTitle(`Ping de ${client.user.tag}`)
        .setDescription(`**🏓Pong!\nPing del bot:** __${client.ws.ping}ms__`)
        .setColor(config.color)
      interaction.reply({embeds: [embed]});
  }
};