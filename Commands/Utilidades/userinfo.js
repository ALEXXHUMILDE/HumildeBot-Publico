const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  ChannelType,
} = require("discord.js");
const clientConfig = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Mira la información o el avatar de un usuario.")
    .addSubcommand(command =>
      command
        .setName("info")
        .setDescription("Mira la información de un usuario.")
        .addUserOption(option =>
          option.setName("usuario")
            .setDescription("Usuario del que quieres obtener información.")
            .setRequired(false)
        )
    )
    .addSubcommand(command =>
      command
        .setName("avatar")
        .setDescription("Mira el avatar de un usuario.")
        .addUserOption(option =>
          option.setName("usuario")
            .setDescription("Usuario del que quieres ver el avatar.")
            .setRequired(false)
        )
    )
    .addSubcommand(command =>
      command
        .setName("banner")
        .setDescription("Mira el banner de un usuario.")
        .addUserOption(option =>
          option.setName("usuario")
            .setDescription("Usuario del que quieres ver el banner.")
            .setRequired(false)
        )
    )
    .setDMPermission(false),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const sub = options.getSubcommand();

    switch (sub) {
      case 'info':
        try {
          const formatter = new Intl.ListFormat('en-GB', { style: 'narrow', type: 'conjunction' });

          const badges = {
            Staff: "<:_:1179997854517960844>",
            Partner: "<:_:1179994707426816092>",
            Hypesquad: "<:_:1179995097505464320>",
            BugHunterLevel1: "<:_:1179995313436639363>",
            HypeSquadOnlineHouse1: "<:_:1179995655180140615>",
            HypeSquadOnlineHouse2: "<:_:1179995792090607756>",
            HypeSquadOnlineHouse3: "<:_:1179995723937349692>",
            PremiumEarlySupporter: "<:_:1179996333801754776>",
            BugHunterLevel2: "<:_:1179997005947355146>",
            VerifiedBot: "<:_:1179997263481806918>",
            VerifiedDeveloper: "<:_:1179997412048248972>",
            CertifiedModerator: "<:_:1179997750729908224>",
            BotHttpInteractions: "<:_:1179998099217846272>",
            ActiveDeveloper: "<:_:1179998207590273124>",
          };

          const user = interaction.options.getUser("usuario") || interaction.user;
          const userFlags = user.flags.toArray();
          const member = await interaction.guild.members.fetch(user.id);
          const topRoles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role)
            .slice(0, 3);
          const banner = await (await client.users.fetch(user.id, { force: true })).bannerURL({ size: 4096 });
          const booster = member.premiumSince ? `<:_:1180644785221025792> Yes` : `No`;
          const ownerE = `<:_:1180644654400688199>`;
          const devs = `<:_:1179998207590273124>`;
          const owners = `<:_:1180644654400688199>`;
          const mutualServers = [];
          const joinPosition = await interaction.guild.members.fetch()
            .then(members => members.sort((a, b) => a.joinedAt - b.joinedAt).map(user => user.id).indexOf(member.id) + 1);

          for (const guild of client.guilds.cache.values()) {
            if (guild.members.cache.has(member.id)) {
              mutualServers.push(`[${guild.name}](https://discord.com/guilds/${guild.id})`);
            }
          }

          const embed = new EmbedBuilder()
            .setAuthor({ name: `Información`, iconURL: member.displayAvatarURL() })
            .setTitle(`**${member.user.tag}** ${userFlags.length ? formatter.format(userFlags.map(flag => `${badges[flag]}`)) : ` `}`)
            .setColor(clientConfig.color)
            .setThumbnail(member.displayAvatarURL())
            .setDescription(`**ID** - ${member.id}\n• **Booster** - ${booster}\n• **Roles** - ${topRoles.join(', ')}\n• **Se unió** - <t:${parseInt(member.joinedAt / 1000)}:R>\n• **Usuario de Discord** - <t:${parseInt(user.createdAt / 1000)}:R>`)
            .addFields({ name: `Banner`, value: banner ? " " : "No" })
            .setImage(banner || null)
            .setFooter({ text: `${client.user.tag} || ${client.ws.ping}ms`, iconURL: client.user.displayAvatarURL() });

          if (member.id === interaction.guild.ownerId) {
            embed
              .setTitle(`**${member.user.tag}** ${ownerE} ${userFlags.length ? formatter.format(userFlags.map(flag => `${badges[flag]}`)) : ` `}`);
          }

          if (owners.includes(member.id)) {
            embed
              .setTitle(`**${member.user.tag}** ${devs} ${userFlags.length ? formatter.format(userFlags.map(flag => `${badges[flag]}`)) : ` `}`);
          }

          if (owners.includes(member.id) && member.id === interaction.guild.ownerId) {
            embed
              .setTitle(`**${member.user.tag}** ${devs} ${ownerE} ${userFlags.length ? formatter.format(userFlags.map(flag => `${badges[flag]}`)) : ` `}`);
          }

          await interaction.reply({ embeds: [embed] });
        } catch (error) {
          const embed2 = new EmbedBuilder()
            .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`<a:_:1082895947106889820> | Este usuario no se encuentra en este servidor, por favor ingresa un miembro de este servidor.`)
            .setColor(clientConfig.color)
            .setTitle(`<a:_:1082895947106889820> | Error`)
            .setFooter({ text: `${client.user.tag} || ${client.ws.ping}ms`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

          await interaction.reply({ embeds: [embed2] });
        }
        break;

      case 'avatar':
        try {
          const user = interaction.options.getUser('usuario') || interaction.user;
          const embed = new EmbedBuilder()
            .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
            .setTitle(`Avatar de ${user.username}`)
            .setColor(clientConfig.color)
            .setImage(`${user.displayAvatarURL({ dynamic: true, size: 4096 })}`)
            .setTimestamp()
            .setFooter({ text: `${client.user.tag} || ${client.ws.ping}ms`, iconURL: client.user.displayAvatarURL() });

          await interaction.reply({ embeds: [embed] });
        } catch (error) {
          interaction.reply({ content: '<a:_:1082895947106889820> | Algo salió mal, por favor intenta de nuevo.', ephemeral: true });
        }
        break;

      case 'banner':
        try {
          const user = interaction.options.getUser("usuario") || interaction.user;
          const member = await interaction.guild.members.fetch(user.id);
          const banner = await (await client.users.fetch(user.id, { force: true })).bannerURL({ size: 4096 });

          const embed = new EmbedBuilder()
            .setColor(clientConfig.color)
            .setAuthor({ name: `${user.tag}`, iconURL: member.displayAvatarURL() })
            .addFields({ name: `Banner de ${user.username}`, value: banner ? " " : "<a:_:1082895947106889820> | Este usuario no tiene banner." })
            .setImage(banner || null)
            .setTimestamp()
            .setFooter({ text: `${client.user.tag} || ${client.ws.ping}ms`, iconURL: client.user.displayAvatarURL() });

          await interaction.reply({ embeds: [embed] });
        } catch (error) {
          interaction.reply({ content: '<a:_:1082895947106889820> | Algo salió mal, por favor intenta de nuevo.', ephemeral: true });
        }
        break;
    }
  }
};
