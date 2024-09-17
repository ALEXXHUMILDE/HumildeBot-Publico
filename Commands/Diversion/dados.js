const Discord = require('discord.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
   data: new SlashCommandBuilder()
      .setName('dados')
      .setDescription('Lanzaré unos dados aleatoriamente.'),

   execute(interaction) {
      const { options } = interaction;
      let resultados = [`🎲 1`, `🎲 2`, `🎲 3`, `🎲 4`, `🎲 5`, `🎲 6`, `🎲 7`, `🎲 8`, `🎲 9`, `🎲 10`, `🎲 11`, `🎲 12`, `🎲 13`, `🎲 14`, `🎲 15`, `🎲 16`, `🎲 17`, `🎲 18`, `🎲 19`, `🎲 20`];

      const embed = new EmbedBuilder()
         .setColor('Random')
         .setTitle('Dados 🎲')
         .setImage('https://www.gifsanimados.org/data/media/710/dado-imagen-animada-0104.gif')
         .addFields(
            { name: 'Resultado', value: `${resultados[Math.floor(Math.random() * resultados.length)]}` }
         );

      interaction.channel.send({ embeds: [embed] });
      interaction.reply({ content: 'Tirando dados 🎲...', ephemeral: false });
   },
};
