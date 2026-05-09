const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { primary, cyan } = require('../../utils/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Affiche la liste des commandes'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(primary)
      .setTitle('🌍 Aide ORIZON')
      .setDescription('Voici les catégories de commandes :')
      .addFields(
        { name: '👑 Admin', value: '`/ban`, `/kick`, `/mute`, `/clear`, ...' },
        { name: '🌍 Communauté', value: '`/userinfo`, `/serverinfo`, `/suggest`, ...' },
        { name: '💰 Économie', value: '`/balance`, `/daily`, `/work`, `/shop`, ...' },
        { name: '🎲 Jeux', value: '`/dice`, `/coinflip`, `/roll`' },
        { name: '📻 Radio', value: '`/radio play`, `/radio stop`, `/radio stations`' }
      )
      .setFooter({ text: 'ORIZON - La communauté haïtienne mondiale' });
    interaction.reply({ embeds: [embed] });
  }
};