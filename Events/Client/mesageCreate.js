const { ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ActionRowBuilder, Message } = require("discord.js");
const config = require("../../config.json")

module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  execute(message, client) {
    if (message.mentions.has(client.user) && !message.mentions.everyone) {
      const embed = new EmbedBuilder()
        .setAuthor({ name: `¡Hola ${message.author.username}!`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(`Mi nombre es ${client.user.username}, soy un bot con una variedad de comandos, como, utilidades, diversión y moderación que serán útiles para tu servidor. También si quieres votarme en [Top.gg](https://top.gg/bot/1043990016696795207/vote) o en [Discord List](https://discordlist.gg/bot/1043990016696795207/vote), sería de gran ayuda. Si quieres ver más características de mí, puedes visitar mi [web](https://humilde.ml).\n\n**Invitarlo**: [Click aquí!](https://dsc.gg/humilde-bot) para ver mis comandos.`)
        .setColor(config.color);

      const buttontop = new ButtonBuilder()
        .setStyle("Link")
        .setLabel("Votar en Top.gg")
        .setURL("https://top.gg/bot/1043990016696795207/vote");

      const buttonlist = new ButtonBuilder()
        .setStyle("Link")
        .setLabel("Votar en Discord List")
        .setURL("https://discordlist.gg/bot/1043990016696795207/vote");

      const buttonweb = new ButtonBuilder()
        .setStyle("Link")
        .setLabel("Website")
        .setURL("https://humildebot.pages.dev");

      const buttoninvite = new ButtonBuilder()
        .setStyle("Link")
        .setLabel("Invitarme")
        .setURL("https://dsc.gg/humilde-bot");

      const row = new ActionRowBuilder()
        .addComponents(buttontop, buttonlist, buttonweb, buttoninvite);

      message.channel.send({ embeds: [embed], components: [row] });
    }
  },
};
