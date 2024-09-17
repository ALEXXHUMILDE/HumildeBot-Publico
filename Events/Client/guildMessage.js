const { ChatInputCommandInteraction, EmbedBuilder, ChannelType } = require("discord.js");
const config = require("../../config.json")

module.exports = {
  name: "guildCreate",
  /**
   *
   * @param {Guild} guild
   * @param {Client} client
   */
  execute(guild, client) {

    const topChannel = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).sort((a, b) => a.rawPosition - b.rawPosition || a.id - b.id).first();

    if (topChannel) {
      try {
        const embed = new EmbedBuilder()
          .setTitle("**> ¡Gracias por invitarme!**")
          .setDescription(
            `¡Hola ${guild.name}! Muchas gracias por invitarme a tu servidor. Soy Humilde, un bot de Discord con comandos de utilidad, moderación y diversión. Si necesitas ayuda, no dudes en utilizar el comando /help.`
          )
          .setColor(config.color)
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setFooter({
            text: `${client.user.username}`,
            iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
          })
          .setTimestamp();
        topChannel.send({ embeds: [embed] });
      } catch (error) {
        console.error(error);
      }
    }
  }
}
