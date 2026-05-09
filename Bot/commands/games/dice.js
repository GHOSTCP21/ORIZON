const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { accent } = require('../../utils/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Lancer un dé (1-6)'),
  async execute(interaction) {
    const roll = Math.floor(Math.random() * 6) + 1;
    const embed = new EmbedBuilder()
      .setColor(accent)
      .setTitle('🎲 Lancer de dé')
      .setDescription(`Vous avez obtenu : **${roll}**`);
    interaction.reply({ embeds: [embed] });
  }
};